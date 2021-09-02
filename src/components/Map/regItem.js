import G6 from '@antv/g6';
import { transform, mat3 } from '@antv/matrix-util';

const DEFAULT_TEXT_COLOR = '#303133';
const ICON_SIZE = 50;
const TEXT_OFFSET = 17;
const TEXT_SIZE = 12;

G6.registerCombo(
  'network_node_as_group',
  {
    options: {
      animate: false,
      size: [50, 50],
      padding: [60, 20, 20, 20],
      labelCfg: {
        refX: 60,
        refY: 18,
        style: {
          fontSize: 14,
        }
      }
    },
    drawShape(cfg, group) {
      const style = this.getShapeStyle(cfg);
      const icon = cfg.icon;
      const color = cfg.color;
      cfg.labelCfg = this.options.labelCfg;
      cfg.labelCfg.style.fill = color;
      // style.width和style.height对应combo的width和height，包含默认size和padding
      const rect = group.addShape('rect', {
        attrs: {
          stroke: color,
          lineWidth: 1,
          x: -style.width / 2,
          y: -style.height / 2,
          width: style.width,
          height: style.height,
        },
        draggable: true,
        name: 'combo-shape',
      });
      group.addShape('image', {
        attrs: {
          x: -style.width / 2,
          y: -style.height / 2,
          width: ICON_SIZE,
          height: ICON_SIZE,
          img: icon,
        },
        draggable: true,
        name: 'icon-shape',
      });
      if (cfg.nom.boundary_interfaces && cfg.nom.boundary_interfaces.length > 0) {
        const igwModel = cfg.nom.boundary_interfaces[0];
        group.addShape('image', {
          attrs: {
            x: -ICON_SIZE / 2,
            y: -style.height / 2 - ICON_SIZE / 2,
            width: ICON_SIZE,
            height: ICON_SIZE,
            img: igwModel.icon,
          },
          draggable: true,
          name: 'icon-igw-shape',
        });
      }
      return rect;
    },
    afterUpdate(cfg, item) {
      const self = this;
      const model = item.get('model');
      const group = item.get('group');
      const options = this.getOptions(cfg);
      const keyShape = item.getKeyShape();
      const iconShape = group.find(ele => ele.get('name') === 'icon-shape');
      const igwShape = group.find(ele => ele.get('name') === 'icon-igw-shape');
      // options.style.width和options.style.height对应combo的innerWidth和innerHeight，不包含padding
      keyShape.attr({
        width: options.style.width + options.padding[1] + options.padding[3],
        height: options.style.height + options.padding[0] + options.padding[2],
      });
      iconShape.attr({
        x: -options.style.width / 2 - options.padding[3],
        y: -options.style.height / 2 - options.padding[0],
      });
      if (igwShape) {
        igwShape.attr({
          x: -ICON_SIZE / 2,
          y: -options.style.height / 2 - options.padding[0] - ICON_SIZE / 2,
        });
      }
      if (model.collapsed) {
        cfg.padding = [0, 0, 0, 0];
        cfg.labelCfg = {
          position: 'bottom',
          refX: 0,
          refY: TEXT_OFFSET,
          style: {
            fill: DEFAULT_TEXT_COLOR,
            fontSize: TEXT_SIZE,
          }
        };
        keyShape.hide();
        if (igwShape) {
          igwShape.hide();
        }
      } else {
        cfg.padding = self.options.padding;
        cfg.labelCfg = self.options.labelCfg;
        keyShape.show();
        if (igwShape) {
          igwShape.show();
        }
      }
    },
  },
  'rect',
);

G6.registerNode(
  'network_node',
  {
    getCustomConfig(cfg) {
      return {
        img: cfg.icon,
        size: ICON_SIZE,
      };
    },
  },
  'image',
);

G6.registerEdge(
  'vpc_peering',
  {
    getKeyPath(cfg) {
      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;
      const midPoint = {
        x: startPoint.x + (endPoint.x - startPoint.x) / 2,
        y: startPoint.y + (endPoint.y - startPoint.y) / 2,
      };
      const path = [['M', startPoint.x, startPoint.y]];
      if (cfg.icon) {
        const radian = Math.atan((endPoint.y - startPoint.y) / (endPoint.x - startPoint.x));
        const offsetX = Math.abs(Math.cos(radian) * ICON_SIZE / 2);
        const offsetY = Math.abs(Math.sin(radian) * ICON_SIZE / 2);
        path.push(['L', midPoint.x + (midPoint.x > startPoint.x ? -offsetX : offsetX),
                        midPoint.y + (midPoint.y > startPoint.y ? -offsetY : offsetY)]);
        path.push(['M', midPoint.x + (midPoint.x > startPoint.x ? offsetX : -offsetX),
                        midPoint.y + (midPoint.y > startPoint.y ? offsetY : -offsetY)]);
      }
      path.push(['L', endPoint.x, endPoint.y]);
      return path;
    },
    draw(cfg, group) {
      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;
      const midPoint = {
        x: startPoint.x + (endPoint.x - startPoint.x) / 2,
        y: startPoint.y + (endPoint.y - startPoint.y) / 2,
      };
      const path = this.getKeyPath(cfg);
      const shape = group.addShape('path', {
        attrs: {
          stroke: cfg.color,
          path,
        },
        name: 'edge-shape',
      });
      if (cfg.icon) {
        const image = new Image();
        image.src = cfg.icon;
        group.addShape('image', {
          attrs: {
            x: midPoint.x - ICON_SIZE / 2,
            y: midPoint.y - ICON_SIZE / 2,
            width: ICON_SIZE,
            height: ICON_SIZE,
            img: image,
          },
          draggable: true,
          name: 'icon-shape',
        });
      }
      const labelOffsetY = cfg.icon ? TEXT_OFFSET + ICON_SIZE / 2 : 0;
      group.addShape('text', {
        attrs: {
          text: cfg.label,
          textAlign: 'center',
          x: midPoint.x,
          y: midPoint.y + labelOffsetY,
          fill: cfg.color || DEFAULT_TEXT_COLOR,
          fontSize: TEXT_SIZE,
        },
        draggable: true,
        name: 'text-shape',
      });
      return shape;
    },
    update(cfg, item) {
      const model = item.get('model');
      const startPoint = model.startPoint;
      const endPoint = model.endPoint;
      const midPoint = {
        x: startPoint.x + (endPoint.x - startPoint.x) / 2,
        y: startPoint.y + (endPoint.y - startPoint.y) / 2,
      };
      const group = item.get('group');
      const shape = item.getKeyShape();
      const iconShape = group.find(ele => ele.get('name') === 'icon-shape');
      if (iconShape) {
        iconShape.attr({
          x: midPoint.x - ICON_SIZE / 2,
          y: midPoint.y - ICON_SIZE / 2,
        });
      }
      const textShape = group.find(ele => ele.get('name') === 'text-shape');
      if (textShape) {
        const labelOffsetY = iconShape ? TEXT_OFFSET + ICON_SIZE / 2 : 0;
        textShape.attr({
          x: midPoint.x,
          y: midPoint.y + labelOffsetY,
        });
      }
      const path = this.getKeyPath(model);
      shape.attr({ path });
    }
  },
  'single-edge',
);

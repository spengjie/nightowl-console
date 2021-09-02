import G6 from '@antv/g6';

G6.registerBehavior(
  'drag-combo-node-realtime-update',
  {
    getEvents() {
      return {
        'node:drag': 'onDragNode',
        'combo:drag': 'onDragCombo',
      };
    },
    onDragNode(event) {
      const comboId = event.item.getModel().comboId;
      if (comboId) {
        const combo = this.graph.findById(comboId);
        this.graph.updateCombo(combo);
      }
    },
    onDragCombo(event) {
      const parentId = event.item.getModel().parentId;
      if (parentId) {
        const combo = this.graph.findById(parentId);
        this.graph.updateCombo(combo);
      }
    },
  },
);

G6.registerBehavior(
  'zoom-canvas-fix-ratio',
  {
    getDefaultCfg() {
      return {
        delta: 0.2,
      };
    },
    getEvents() {
      return {
        'wheel': 'onWheel',
      };
    },
    onWheel(event) {
      event.preventDefault();
      const canvas = this.graph.get('canvas');
      const points = canvas.getPointByClient(event.clientX, event.clientY);
      const delta = this.get('delta');
      const zoom = this.graph.getZoom() + (event.wheelDelta < 0 ? -delta : delta);
      this.graph.zoomTo(zoom, { x: points.x, y: points.y });
      this.graph.emit('wheelzoom', event);
    },
    onDragCombo(event) {
      const parentId = event.item.getModel().parentId;
      if (parentId) {
        const combo = this.graph.findById(parentId);
        this.graph.updateCombo(combo);
      }
    },
  },
);

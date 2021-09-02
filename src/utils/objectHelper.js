export function compareObject(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  if (aProps.length != bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    var propA = a[propName];
    var propB = b[propName];
    if ((typeof (propA) === 'object')) {
      if (this.isObjectValueEqual(propA, propB)) {
        return true;
      } else {
        return false;
      }
    } else if (propA !== propB) {
      return false;
    } else {
      return a === b;
    }
  }
  return true;
}

export function getProp(o, props) {
  const propNames = props.split('.');
  let obj = o;
  for (const propName of propNames) {
    obj = obj[propName];
    if (obj === undefined || obj === null || isNaN(obj)) {
      return obj;
    }
  }
  return obj;
}

export function clone(obj) {
  // Handle the 3 simple types, and null or undefined or function
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
      let copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
  }
  // Handle Array or Object
  if (obj instanceof Array | obj instanceof Object) {
    let copy = (obj instanceof Array) ? [] : {};
      for (const attr in obj) {
          // eslint-disable-next-line no-prototype-builtins
          if (obj.hasOwnProperty(attr))
            copy[attr] = clone(obj[attr]);
      }
      return copy;
  }
  throw new Error("Unable to clone obj! Its type isn't supported.");
}

export function precedeWidth(num, width) {
  return(Array(width).join('0') + num).slice(-width);
}

export function blobAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = event => {
      resolve(event.target.result);
    };
    reader.onerror = error => {
      reader.abort();
      reject(error);
    };

    reader.readAsDataURL(blob);
  });
}

export function blobAsUint8Array(blob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = event => {
      resolve(new Uint8Array(event.target.result));
    };
    reader.onerror = error => {
      reader.abort();
      reject(error);
    };

    reader.readAsArrayBuffer(blob);
  });
}

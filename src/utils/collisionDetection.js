export const collisionDetection = (object1, object2) => {
  const bounds1 = object1.getBounds();
  const bounds2 = object2.getBounds();

  return bounds1.x < bounds2.x + bounds2.width
    && bounds1.x + bounds1.width > bounds2.x
    && bounds1.y < bounds2.y + bounds2.height
    && bounds1.y + bounds1.height > bounds2.y;
};
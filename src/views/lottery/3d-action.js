import { cardSize, objects, scene, render } from './3d-core.js';
const TWEEN = window.TWEEN;
import { setCardDist } from './3d-calc-distance.js';

function cardFlyAnimation(cardIndexList) {
  return new Promise((resolve) => {
    const selectObject = [];
    cardIndexList.forEach((item) => {
      selectObject.push(objects[item]);
    });
    const locates = [];
    const duration = 600;

    // 修改：根据卡片数量动态调整每行显示的卡片数量
    let colNum = 10; // 默认10列
    const objectLength = selectObject.length;
    
    // 根据卡片数量调整列数
    if (objectLength >= 100) {
      colNum = 20; // 100个以上显示20列
    } else if (objectLength >= 50) {
      colNum = 10; // 50-99个显示15列
    }
    
    const selectRowCount = Math.ceil(objectLength / colNum); // 行数 根据数量和列数计算
    const cardPadding = 30;
    
    const canvasSize = {
      width: (colNum + 1) * (cardSize.width + cardPadding),
      height: (selectRowCount + 1) * (cardSize.height + cardPadding)
    }

    // 计算中奖卡片位置
    const everyRowCount = colNum;
    for (let i = 0; i < selectRowCount; i++) {
      const currentObjects = selectObject.slice(i * everyRowCount, (i+1) * everyRowCount);
      for (let j = 0; j < currentObjects.length; j++) {
        locates.push({
          x: ((cardSize.width + cardPadding) * (j + 1)) - (canvasSize.width / 2),
          y: -(cardSize.height + cardPadding) * (i + 1) + (canvasSize.height / 2)
        });
      }
    }

    // 运行卡片动画 - 以下代码保持不变
    selectObject.forEach((object, index) => {
      const objectsWidth = (cardSize.width + cardPadding) * colNum - cardPadding;
      const objectsHeight = (cardSize.height + cardPadding) * selectRowCount - cardPadding;
      const cardDistZ = setCardDist(objectsWidth, objectsHeight);

      new TWEEN.Tween(object.position)
        .to(
          {
            x: locates[index].x,
            y: locates[index].y,
            z: cardDistZ
          },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

      new TWEEN.Tween(object.rotation)
        .to(
          { x: 0, y: 0, z: 0 },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

      object.element.classList.add("prize");
    });

    new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onUpdate(render)
      .start()
      .onComplete(() => {
        resolve();
      });
  });
}

// 旋转3D场景
function rotateBall() {
  const circleCount = 10000; // 1万圈
  const durationTime = 1000 * circleCount / 4;
  return new Promise((resolve) => {
    scene.rotation.y = 0;
    new TWEEN.Tween(scene.rotation)
      .to(
        {
          y: Math.PI * circleCount,
        },
        durationTime
      )
      .onUpdate(render)
      .easing(TWEEN.Easing.Linear.None)
      .start()
      .onComplete(() => {
        resolve();
      });
  });
}

// 停止旋转
function rotateBallStop() {
  TWEEN.removeAll();
  setTimeout(() => {
    scene.rotation.x = 0;
    scene.rotation.y = 0;
    scene.rotation.z = 0;
    render();
  }, 0);
}

export { rotateBall, rotateBallStop, cardFlyAnimation }
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

    // 计算列数和行数 - 动态调整布局
    let colNum;
    const objectLength = selectObject.length;
    
    // 根据不同数量设置不同列数
    if (objectLength <= 5) {
      colNum = 3;
    } else if (objectLength <= 20) {
      colNum = 5;
    } else if (objectLength > 50) {
      colNum = 15;
    } else {
      colNum = 10;
    }
    
    const selectRowCount = Math.ceil(objectLength / colNum);
    const cardPadding = 30;
    
    // 计算画布大小
    const canvasSize = {
      width: colNum * (cardSize.width + cardPadding) + cardPadding,
      height: selectRowCount * (cardSize.height + cardPadding) + cardPadding
    }

    // 计算中奖卡片位置 - 确保居中显示
    for (let i = 0; i < selectRowCount; i++) {
      const currentRowCount = Math.min(colNum, objectLength - i * colNum);
      // 计算当前行的偏移量，使整行居中
      const rowOffset = (colNum - currentRowCount) * (cardSize.width + cardPadding) / 2;
      
      for (let j = 0; j < currentRowCount; j++) {
        locates.push({
          x: ((cardSize.width + cardPadding) * j) + rowOffset - (canvasSize.width / 2) + (cardSize.width + cardPadding) / 2,
          y: -((cardSize.height + cardPadding) * i) + (canvasSize.height / 2) - (cardSize.height + cardPadding) / 2
        });
      }
    }

    // 运行卡片动画 - 设置Z轴位置使其在球体中心
    selectObject.forEach((object, index) => {
      const objectsWidth = colNum * (cardSize.width + cardPadding) - cardPadding;
      const objectsHeight = selectRowCount * (cardSize.height + cardPadding) - cardPadding;
      const cardDistZ = setCardDist(objectsWidth, objectsHeight);

      new TWEEN.Tween(object.position)
        .to(
          {
            x: locates[index].x,
            y: locates[index].y,
            z: cardDistZ // 这个Z轴位置会让卡片在球体中心位置显示
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
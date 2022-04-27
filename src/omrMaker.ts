
  /******omr 관련 ************/
  const markOmr = async function (answerData) {
    /** @type {string} **/
    const omrFileId: string = "1vuov9wZtD4ZXMMg_oGDMjc4qERlLwMgm";
    /** @type {HTMLImageElement} **/
    
    const img: HTMLImageElement = new Image();

    const srcData = await asyncRun({
      serverFunction: "fileDataToClient",
      args: [omrFileId],
    });
    //배경 omr 띄움
    typeof srcData == 'string' ? (img.src = srcData) : (img.src = '')
    
    const canvas: HTMLCanvasElement | null = document.querySelector("#canvas");
    let c: unknown
    canvas ? (c = canvas.getContext("2d")) : c = null
    c.fillStyle = "black"

    //canvas clear하고 img 다시 띄움
    const imgLoad = () => {
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.beginPath();
      c.drawImage(img, 0, 0);
    };

    //from stackOverFlow - canvas에 ellipse 그리는 함수
    const drawEllipse = (c, x, y, w, h) => {
      var kappa = 0.5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w, // x-end
        ye = y + h, // y-end
        xm = x + w / 2, // x-middle
        ym = y + h / 2; // y-middle

      c.beginPath();
      c.moveTo(x, ym);
      c.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      c.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      c.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      c.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      c.stroke();
      c.fill();
    };

    const drawEllipseByCenter = (c, cx, cy) => {
      const w = 6;
      const h = 14;
      drawEllipse(c, cx - w / 2.0, cy - h / 2.0, w, h);
    };

    //omr 위 사각형으로 위치 잡는 객체
    class answerBox {
      //실제로 마킹하는 함수(ellipseByCenter는 상자 중심을 인수로 넘겨줘야 함)
      markEllipse(x, y) {
        drawEllipseByCenter(c, x + this._boxWidth / 2, y + this._boxHeight / 2);
      }
      //마킹좌표 잡는 함수(count: 자릿수(x축) , number: 수(y축))
      markRow(count, number) {
        this.markEllipse(
          this.startx + count * this._boxWidth,
          this.starty + number * this._boxHeight
        );
      }
      constructor(startx, starty) {
        this.startx = startx;
        this.starty = starty;
        this._boxWidth = 21.5;
        this._boxHeight = 36;
      }
    }

    // 마킹
    const codeMarking = (numberCode, x, y, total) => {
      const marker = new answerBox(x, y);
      //길이 체크
      if (numberCode.length > total) {
        throw "Too long";
      } else if (total == 5 && total != numberCode.length) {
        throw `usercode or examcode error`;
      }
      let count = total - numberCode.length; //자릿수에 맞게 들어가게 함
      for (let i of numberCode) {
        marker.markRow(count++, i);
      }
    };

    //시작 좌표들
    const startXY = {
      userCode: [271, 457],
      examCode: [400, 457],
      answers: [
        [547, 155],[622, 155],[697, 155],
        [785, 155],[860, 155],[935, 155],
        [1023, 155],[1098, 155],[1173, 155],
        [547, 548], [622, 548],[697, 548],
        [785, 548],[860, 548],[935, 548],
      ],
    };
    const urlArray = [];
    //다운로드를 위해 각 canvas url 저장배열
    /**값 불러와서 마킹하고 테이블에 띄우기 **/
    answerData.forEach(singleOmr => {
      imgLoad(); //canvas 초기화 함수
      try {
        codeMarking(
          singleOmr.userCode,
          startXY.userCode[0],
          startXY.userCode[1],
          5
        );
        codeMarking(
          singleOmr.examCode,
          startXY.examCode[0],
          startXY.examCode[1],
          5
        );
        let count = 0;
        for (let num of singleOmr.answers) {
          codeMarking(
            num,
            startXY.answers[count][0],
            startXY.answers[count++][1],
            3
          );
        }
        // console.log(`${singleOmr.userName}_${singleOmr.userCode}_${singleOmr.examCode}.png`)
        urlArray.push({
          name: `${singleOmr.userName}_${singleOmr.userCode}_${singleOmr.examCode}.png`,
          url: canvas.toDataURL(),
        });
        
      } catch (err) {
        console.log(`${err} Skiped ${singleOmr.userCode}`);
      }
    });
    return urlArray
  };
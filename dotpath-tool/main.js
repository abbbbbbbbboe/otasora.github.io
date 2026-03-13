const canvasElement = document.querySelector('.canvas');
const dlButtonElment = document.querySelector('.dlButton');
const clearButtonElement = document.querySelector('.clearButton');
const backButtonElement = document.querySelector('.backButton');
const UIokButtonElement = document.querySelector('.inputButton');
const panelWidth = document.querySelector('#width');
const panelHeight = document.querySelector('#height');
const gridSizeInput = document.querySelector('#gridSizeInput');
const lineWidthInput = document.querySelector('#lineWidthInput');
const selectColorInput = document.querySelector("#selectColor");


dlButtonElment.disabled = true;

const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); //名前空間の作成
svg.setAttribute("width", 500); //サイズを設定
svg.setAttribute("height", 500); //サイズを設定
svg.setAttribute("viewBox", "0 0 500 500"); //viewBoxを設定、左上の座標0,0 横幅500 縦幅500
canvasElement.appendChild(svg); //.canvas要素に追加

const gridLayer = document.createElementNS("http://www.w3.org/2000/svg", "g"); //gridLayer要素を作る
gridLayer.setAttribute("id", "gridLayer"); //識別用にgridLayer要素にidをつける

const pathLayer = document.createElementNS("http://www.w3.org/2000/svg", "g"); //pathLayer要素を作る
pathLayer.setAttribute("id", "pathLayer"); //識別用にpathLayer要素にidをつける

svg.appendChild(gridLayer); //gタグid=gridlayer要素をsvg要素のなかに追加
svg.appendChild(pathLayer); //gタグid=pathlayer要素をsvg要素のなかに追加


let gridSize = 4; //ドット間隔

let lineWidthValue = 2;
let selectColorValue = "gray";

//グリットの範囲
const gridWidth = 500;
const gridHeight = 500;

function createGrid(width, height, gridSize) {
//ドットをグリット上に並べる。for文で範囲を作って繰り返し行うことで羅列する。
    for (let y = 0; y <= height; y += gridSize) {
        for (let x = 0; x <= width; x += gridSize) {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle"); //circle要素を作る
            circle.setAttribute("cx", x); //circle要素の属性と値。cx=横向きの位置　x=代入される値
            circle.setAttribute("cy", y); //circle要素の属性と値。cy=縦向きの位置　y=代入される値
            circle.setAttribute("r", 2); //半径の大きさ
            circle.setAttribute("fill", "#f0f6f7"); //svgの塗りの色
            gridLayer.appendChild(circle);
        }
    }

}

createGrid(gridWidth, gridHeight, gridSize);



UIokButtonElement.addEventListener("click", () => {
    let panelWidthValue = Number(panelWidth.value);
    let panelHeightValue = Number(panelHeight.value);
    let gridSizeInputvalue = Number(gridSizeInput.value);
    let lineWidthInputValue = parseInt(lineWidthInput.value);


    if (!panelWidthValue || isNaN(panelWidthValue)){
        panelWidthValue = 500;
    }
     if (!panelHeightValue || isNaN(panelHeightValue)){
        panelHeightValue = 500;
    }

    if (!gridSizeInputvalue || isNaN(gridSizeInputvalue)){
        gridSizeInputvalue = 4;
    }

    if (isNaN(lineWidthInputValue)) {
        lineWidthInputValue = 2;
    }
    lineWidthValue = lineWidthInputValue;

    svg.setAttribute("width", panelWidthValue); //サイズを設定
    svg.setAttribute("height", panelHeightValue); //サイズを設定
    svg.setAttribute("viewBox", `0 0 ${panelWidthValue} ${panelHeightValue}`);


    // gridSize = gridSizeInputvalue;

    gridLayer.innerHTML = "";
    createGrid(panelWidthValue, panelHeightValue, gridSizeInputvalue);
    
});
if (selectColorInput) {
    selectColorInput.addEventListener("input", () => {
    selectColorValue = selectColorInput.value;
});
}


//現在描いている線
let currentPolyline = null; //polyline要素を作る


//今描いているpathの数値の配列を入れる入れ物を作る
let currentPathPoints = [];
//書き終わったパスの数値の配列を入れる入れ物を作る
const paths = [];

//Polylineを作るための関数
function updatePolyline() {
    const pointsString = currentPathPoints
        .map(p => `${p.x},${p.y}`)//配列を,区切りで並べる
        .join(" ");//他の数値との間に空白を入れる
    currentPolyline.setAttribute("points", pointsString);
    //points="50,50 100,50 100,100"のようにpathPoinsの中の配列をpolylineに付与
}




//ドラック中かを管理するための変数。false=してない、true=してる
let isDrawing = false;

//svg全体にイベントをつける
svg.addEventListener("mousedown", startDrawing);//マウスがクリックされた状態の時はstartDrawing関数を実行
svg.addEventListener("mousemove", drawing);//マウスが動いたときはdrawing関数を実行
svg.addEventListener("mouseup", endDrawing);//マウスのクリックをやめた状態の時はendDrawing関数を実行

//startDrawing関数　isDrawingの状態をtrueに変更
function startDrawing() {
    isDrawing = true;

    currentPathPoints = [];

    currentPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    currentPolyline.setAttribute("fill", "none");
    currentPolyline.setAttribute("stroke", selectColorValue);
    currentPolyline.setAttribute("stroke-width", lineWidthValue);
    pathLayer.appendChild(currentPolyline);

    dlButtonElment.disabled = false;
}

//endDrawing関数　isDrawingの状態をfalseに変更
function endDrawing() {

    if (currentPathPoints.length > 0) {
        paths.push(currentPathPoints);
    }
    isDrawing = false;
}

//drawing関数　eventは仮引数　点の座標を記録するところまで
function drawing(event) {
    if (!isDrawing) return; //早期リターン　isDrawingがない場合はすぐに出る

    const element = event.target; //イベントが発生した要素

    if (element.tagName !== "circle") return; //elementのタグの名前がcircleではなかったら出る

    const x = Number(element.getAttribute("cx")); //xにイベントが発生した要素のcx属性の文字列を付与。属性は文字列なので、Numberで数字に変換。
    const y = Number(element.getAttribute("cy")); //yにイベントが発生した要素のcy属性の文字列を付与。属性は文字列なので、Numberで数字に変換。

    addPoint(x, y); //addPoint関数にx,yを入れて実行

}

//同じ点が何度も追加されないようにする関数
function addPoint(x, y) {

    const last = currentPathPoints[currentPathPoints.length - 1];//最後の点をlastと定義
    if (last && last.x === x && last.y === y) return; //新しく入った座標とlastの座標が同じなら処理を終了
    currentPathPoints.push({ x, y }); //新しい点をpathPointsの配列に追加
    updatePolyline(); //点が増えるごとにupdatePolyline関数を実行
}

//UI作成

//clearボタン
clearButtonElement.addEventListener("click", clearPath);//clearボタンにクリックイベント付与、clearButton関数を実行
//clearButton関数
function clearPath() {
    pathLayer.innerHTML = "";//pathLayer要素のhtmlを空に

    paths.length = 0;//書き終わったパスの中の要素をなくす

    currentPathPoints = [];

    currentPolyline = null;

    dlButtonElment.disabled = true;
}

//backボタン
backButtonElement.addEventListener("click", backPath);//clearボタンにクリックイベント付与、clearButton関数を実行
//clearButton関数
function backPath() {
    const lastPolyline = pathLayer.lastElementChild;
    if (!lastPolyline) return;
    lastPolyline.remove();

    const polylineElement = document.querySelector("polyline");

    if (!pathLayer.contains(polylineElement)) {
        dlButtonElment.disabled = true;
    }

}


//ダウンロードボタン
dlButtonElment.addEventListener("click", downloadSVG);//downloadボタンにクリックイベント付与、downloadSVG関数を実行



function polylineToPath(polyline) {
    const points = polyline.getAttribute("points");
    const pointList = points.split(" ");

    let pathData = "";

    pointList.forEach((p, index) => {
        const [x, y] = p.split(",");

        if (index === 0) {
            pathData += `M ${x} ${y}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }
    });

    //svgの要素となるように属性をつけているが、まだsvgではない。あくまでここでパスのポイントの位置を要素に属性として付与
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);//d属性にパスのポイントの位置を記述

    //パスの見た目
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", polyline.getAttribute("stroke"));
    path.setAttribute("stroke-width", polyline.getAttribute("stroke-width"));

    return path;//pathに値を返す

}
//downloadSVG関数
function downloadSVG() {
    // const polylineCopy = polyline.cloneNode(true);



    //svgの要素を作成し、そこにpathを追加してダウンロードする要素をsvg形式にしている。
    const exportSVG = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    exportSVG.setAttribute("width", svg.getAttribute("width"));
    exportSVG.setAttribute("height", svg.getAttribute("height"));
    exportSVG.setAttribute("viewBox", svg.getAttribute("viewBox"));

    const polylines = pathLayer.querySelectorAll("polyline");

    polylines.forEach(poly => {
        const path = polylineToPath(poly); //pathの値をpolylineToPathで最終的に返ってきたものにする
        exportSVG.appendChild(path);
    })




    //対象のsvgテキストを取得
    const serializer = new XMLSerializer(); //XMLSerializerはDOM要素、SVG、XMLを文字列に変換するためのオブジェクト
    const svgString = serializer.serializeToString(exportSVG);

    //保存用のBlobオブジェクトを作成
    const blob = new Blob([svgString], { type: "image/svg+xml" }); //Blobはブラウザ内の仮想ファイル
    const url = URL.createObjectURL(blob);

    //ダウンロード用のリンク作成　<a href="blob:xxxx" download="path.svg">
    const a = document.createElement("a");
    a.href = url;
    a.download = "path.svg";

    a.click();//自動で作成したa要素をクリックしてダウンロード

    //一時URLを削除
    URL.revokeObjectURL(url);
}

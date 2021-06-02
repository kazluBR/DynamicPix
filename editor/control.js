const $SVG_LIB = "http://www.w3.org/2000/svg";
const $MIN_DIMENSION = 3;
const $MAX_WIDTH_DIMENSION = 125;
const $MAX_HEIGTH_DIMENSION = 50;
const $MIN_SIZE = 10;
const $MAX_SIZE = 30;
const $BACKGROUND_COLOR = "#ffffff";
const $LINE_COLOR = "#808080";
const $RULE_COLOR = "#ff00ff";
const $ARROW_COLOR = "#ff00ff";

var size = 20;
var width = 5;
var height = 5;
var multiple = 5;

var currentColor = "#000000";
var presetColors = [currentColor];
var clicked = false;

var squareI;
var squareJ;
var colorSquare;

//#region Main Functions
function initialize() {
    for (i = 0; i <= width; i++) {
        createLine(0, i);
    }
    for (i = 0; i <= height; i++) {
        createLine(1, i);
    }
    for (i = 0; i < $MAX_WIDTH_DIMENSION; i++) {
        for (j = 0; j < $MAX_HEIGTH_DIMENSION; j++) {
            createSquare(i, j);
            createSquareAux(i, j);
        }
    }
    createDecreaseArrow(0);
    createIncreaseArrow(0);
    createDecreaseArrow(1);
    createIncreaseArrow(1);
}

function setMultiplePuzzle() {
    multiple = parseInt(document.getElementById("multipleInput").value);
    width = multiple;
    height = multiple;
    refresh();
}

function onColorChange() {
    currentColor = document.getElementById("colorInput").value;
    if (!presetColors.includes(currentColor)) {
        var colorList = document.getElementById("presetColors");
        var newColor = document.createElement("option");
        newColor.value = currentColor;
        colorList.appendChild(newColor);
        presetColors.push(currentColor);
    }
}

function increaseAreaSize() {
    if (size < $MAX_SIZE)
        size += 1;
    changeAreaSize();
}

function decreaseAreaSize() {
    if (size > $MIN_SIZE)
        size -= 1;
    changeAreaSize();
}

function exportJson() {
    var data = {
        colors: [$BACKGROUND_COLOR],
        settings: {
            width: width,
            height: height,
            multiple: multiple
        },
        points: [],
        horizontalNumbers: [],
        verticalNumbers: []
    };
    var square, color;
    for (i = 0; i < height; i++) {
        data.points[i] = [];
        for (j = 0; j < width; j++) {
            square = document.getElementById("square_" + j + "." + i);
            color = square.getAttribute("fill");
            if (!data.colors.includes(color)) {
                data.colors.push(color);
            }
            data.points[i].push(data.colors.findIndex(x => x == color));
        }
    }
    data.horizontalNumbers = getHorizontalNumbers(data);
    data.verticalNumbers = getVerticalNumbers(data);
    data.settings.horizontalNumbersLength = getMaxNumbers(data.horizontalNumbers);
    data.settings.verticalNumbersLength = getMaxNumbers(data.verticalNumbers);
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.download = 'puzzle.json';
    a.href = window.URL.createObjectURL(blob);
    a.click();
}

function endColorsChange() {
    if (clicked) {
        var squareAux, id, square, squareColor;
        for (i = 0; i < width; i++) {
            for (j = 0; j < height; j++) {
                squareAux = document.getElementById("square_aux_" + i + "." + j);
                if (squareAux.getAttribute("opacity") == "1") {
                    id = squareAux.getAttribute("id");
                    id = id.replace("square_aux_", "square_");
                    square = document.getElementById(id);
                    squareColor = squareAux.getAttribute("fill");
                    square.setAttribute("fill", squareColor);
                    if (squareColor == $BACKGROUND_COLOR)
                        square.setAttribute("opacity", "0");
                    else
                        square.setAttribute("opacity", "1");
                    squareAux.setAttribute("fill", $BACKGROUND_COLOR);
                    squareAux.setAttribute("opacity", "0");
                }
            }
        }
        clicked = false;
    }
}
//#endregion

//#region Auxiliar Functions
function changeAreaSize() {
    for (i = 0; i <= width; i++) {
        changeLineSize(0, i);
    }
    for (i = 0; i <= height; i++) {
        changeLineSize(1, i);
    }
    for (i = 0; i < $MAX_WIDTH_DIMENSION; i++) {
        for (j = 0; j < $MAX_HEIGTH_DIMENSION; j++) {
            changeSquareSize(i, j);
            changeSquareAuxSize(i, j);
        }
    }
    changeDecreaseArrowSize(0);
    changeIncreaseArrowSize(0);
    changeDecreaseArrowSize(1);
    changeIncreaseArrowSize(1);
}

function changeLineSize(orientation, i) {
    var line = document.getElementById("line_" + orientation + "." + i);
    if (orientation == 0) {
        line.setAttribute("x1", i * size);
        line.setAttribute("x2", i * size);
        line.setAttribute("y1", 0);
        line.setAttribute("y2", height * size);
    } else {
        line.setAttribute("x1", 0);
        line.setAttribute("x2", width * size);
        line.setAttribute("y1", i * size);
        line.setAttribute("y2", i * size);
    }
}

function changeSquareSize(i, j) {
    var square = document.getElementById("square_" + i + "." + j);
    square.setAttribute("height", size * 0.95);
    square.setAttribute("width", size * 0.95);
    square.setAttribute("x", i * size);
    square.setAttribute("y", j * size);
}

function changeSquareAuxSize(i, j) {
    var squareAux = document.getElementById("square_aux_" + i + "." + j);
    squareAux.setAttribute("height", size * 0.95);
    squareAux.setAttribute("width", size * 0.95);
    squareAux.setAttribute("x", i * size);
    squareAux.setAttribute("y", j * size);
}

function changeDecreaseArrowSize(orientation) {
    var decreaseArrow = document.getElementById("decrease_arrow_" + orientation);
    decreaseArrow.setAttribute("font-size", size);
    if (orientation == 0) {
        decreaseArrow.setAttribute("x", (width * size) / 2);
        decreaseArrow.setAttribute("y", (height * size) + size + size / 2);
    } else {
        decreaseArrow.setAttribute("x", (width * size) + size);
        decreaseArrow.setAttribute("y", (height * size) / 2 + size / 4);
    }
}

function changeIncreaseArrowSize(orientation) {
    var increaseArrow = document.getElementById("increase_arrow_" + orientation);
    increaseArrow.setAttribute("font-size", size);
    if (orientation == 0) {
        increaseArrow.setAttribute("x", (width * size) / 2);
        increaseArrow.setAttribute("y", (height * size) + 2 * size + size / 2);
    } else {
        increaseArrow.setAttribute("x", (width * size) + 2 * size);
        increaseArrow.setAttribute("y", (height * size) / 2 + size / 4);
    }
}

function getHorizontalNumbers(data) {
    var horizontalNumbers = [];
    for (k = 0; k < data.points.length; k++)
        horizontalNumbers[k] = [];
    var count, aux, counting;
    for (i = 0; i < data.points.length; i++) {
        count = 0;
        aux = -1;
        counting = false;
        for (j = data.points[0].length - 1; j >= 0; j--) {
            if (counting) {
                count++;
                if (data.points[i][j] == 0 || data.points[i][j] != aux) {
                    if (data.points[i][j] == 0)
                        counting = false;
                    horizontalNumbers[i].push({ number: count.toString(), color: data.colors[aux] });
                    count = 0;
                }
            } else if (data.points[i][j] > 0 && data.points[i][j] != aux)
                counting = true;
            aux = data.points[i][j];
        }
        if (counting) {
            count++;
            horizontalNumbers[i].push({ number: count.toString(), color: data.colors[aux] });
        }
    }
    return horizontalNumbers;
}

function getVerticalNumbers(data) {
    var verticalNumbers = [];
    for (k = 0; k < data.points[0].length; k++)
        verticalNumbers[k] = [];
    var count, aux, counting;
    for (i = 0; i < data.points[0].length; i++) {
        count = 0;
        aux = -1;
        counting = false;
        for (j = data.points.length - 1; j >= 0; j--) {
            if (counting) {
                count++;
                if (data.points[j][i] == 0 || data.points[j][i] != aux) {
                    if (data.points[j][i] == 0)
                        counting = false;
                    verticalNumbers[i].push({ number: count.toString(), color: data.colors[aux] });
                    count = 0;
                }
            } else if (data.points[j][i] > 0 && data.points[j][i] != aux)
                counting = true;
            aux = data.points[j][i];
        }
        if (counting) {
            count++;
            verticalNumbers[i].push({ number: count.toString(), color: data.colors[aux] });
        }
    }
    return verticalNumbers;
}

function getMaxNumbers(numbers) {
    var bigger = 0;
    var aux = 0;
    for (i = 0; i < numbers.length; i++) {
        aux = numbers[i].length;
        if (aux > bigger)
            bigger = aux;
    }
    return bigger;
}

function refresh() {
    var area = document.getElementById("area");
    while (area.firstChild) {
        area.removeChild(area.firstChild);
    }
    for (i = 0; i <= width; i++) {
        createLine(0, i);
    }
    for (i = 0; i <= height; i++) {
        createLine(1, i);
    }
    var arrows = document.getElementById("arrows");
    while (arrows.firstChild) {
        arrows.removeChild(arrows.firstChild);
    }
    createDecreaseArrow(0);
    createIncreaseArrow(0);
    createDecreaseArrow(1);
    createIncreaseArrow(1);
    for (i = 0; i < $MAX_WIDTH_DIMENSION; i++) {
        for (j = 0; j < $MAX_HEIGTH_DIMENSION; j++) {
            var square = document.getElementById("square_" + i + "." + j);
            var color = square.getAttribute("fill");
            if (color != $BACKGROUND_COLOR) {
                if (i >= width || j >= height)
                    square.setAttribute("opacity", "0");
                else
                    square.setAttribute("opacity", "1");
            }
        }
    }
}

function cleanAllSquaresAux() {
    var squareAux;
    for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {
            squareAux = document.getElementById("square_aux_" + i + "." + j);
            if (squareAux.getAttribute("opacity") == "1") {
                squareAux.setAttribute("fill", $BACKGROUND_COLOR);
                squareAux.setAttribute("opacity", "0");
            }
        }
    }
}

function refreshSquareAux(i, j) {
    squareAux = document.getElementById("square_aux_" + i + "." + j);
    square = document.getElementById("square_" + i + "." + j);
    if (colorSquare == $BACKGROUND_COLOR) {
        squareAux.setAttribute("fill", colorSquare);
        squareAux.setAttribute("opacity", "1");
    } else {
        var squareColor = square.getAttribute("fill");
        if (squareColor == $BACKGROUND_COLOR) {
            squareAux.setAttribute("fill", colorSquare);
            squareAux.setAttribute("opacity", "1");
        }
    }
}
//#endregion

//#region Create SVG Elements Functions
function createLine(orientation, i) {
    var line = document.createElementNS($SVG_LIB, "line");
    line.setAttribute("id", "line_" + orientation + "." + i);
    line.setAttribute("stroke", $LINE_COLOR);
    if ((i % multiple) == 0)
        line.setAttribute("stroke-width", "2");
    else
        line.setAttribute("stroke-width", "1");
    if (orientation == 0) {
        line.setAttribute("x1", i * size);
        line.setAttribute("x2", i * size);
        line.setAttribute("y1", 0);
        line.setAttribute("y2", height * size);
    } else {
        line.setAttribute("x1", 0);
        line.setAttribute("x2", width * size);
        line.setAttribute("y1", i * size);
        line.setAttribute("y2", i * size);
    }
    document.getElementById("area").appendChild(line);
}

function createSquare(i, j) {
    var square = document.createElementNS($SVG_LIB, "rect");
    square.setAttribute("id", "square_" + i + "." + j);
    square.setAttribute("height", size * 0.95);
    square.setAttribute("width", size * 0.95);
    square.setAttribute("x", i * size);
    square.setAttribute("y", j * size);
    square.setAttribute("stroke", $LINE_COLOR);
    square.setAttribute("fill", $BACKGROUND_COLOR);
    square.setAttribute("opacity", "0");
    document.getElementById("squares").appendChild(square);
}

function createSquareAux(i, j) {
    var squareAux = document.createElementNS($SVG_LIB, "rect");
    squareAux.setAttribute("id", "square_aux_" + i + "." + j);
    squareAux.setAttribute("height", size * 0.95);
    squareAux.setAttribute("width", size * 0.95);
    squareAux.setAttribute("x", i * size);
    squareAux.setAttribute("y", j * size);
    squareAux.setAttribute("fill", $BACKGROUND_COLOR);
    squareAux.setAttribute("opacity", "0");
    squareAux.onmouseover = highlightSquare;
    squareAux.onmouseout = fadeSquare;
    squareAux.onmousedown = initColorsChange;
    squareAux.onmousemove = changeColorSquares;
    document.getElementById("squares").appendChild(squareAux);
}

function createDecreaseArrow(orientation) {
    var decreaseArrow = document.createElementNS($SVG_LIB, "text");
    decreaseArrow.setAttribute("id", "decrease_arrow_" + orientation);
    decreaseArrow.setAttribute("font-size", size);
    decreaseArrow.setAttribute("text-anchor", "middle");
    decreaseArrow.setAttribute("fill", $ARROW_COLOR);
    decreaseArrow.setAttribute("opacity", "0.5");
    if (orientation == 0) {
        decreaseArrow.setAttribute("x", (width * size) / 2);
        decreaseArrow.setAttribute("y", (height * size) + size + size / 2);
        decreaseArrow.textContent = "\u2B9D"; // ↑
    } else {
        decreaseArrow.setAttribute("x", (width * size) + size);
        decreaseArrow.setAttribute("y", (height * size) / 2 + size / 4);
        decreaseArrow.textContent = "\u2B9C"; // ←
    }
    decreaseArrow.onmouseover = highlightDecreaseArrow;
    decreaseArrow.onmouseout = fadeDecreaseArrow;
    decreaseArrow.onclick = decreaseSize;
    document.getElementById("arrows").appendChild(decreaseArrow);
}

function createIncreaseArrow(orientation) {
    var increaseArrow = document.createElementNS($SVG_LIB, "text");
    increaseArrow.setAttribute("id", "increase_arrow_" + orientation);
    increaseArrow.setAttribute("font-size", size);
    increaseArrow.setAttribute("text-anchor", "middle");
    increaseArrow.setAttribute("fill", $ARROW_COLOR);
    increaseArrow.setAttribute("opacity", "0.5");
    if (orientation == 0) {
        increaseArrow.setAttribute("x", (width * size) / 2);
        increaseArrow.setAttribute("y", (height * size) + 2 * size + size / 2);
        increaseArrow.textContent = "\u2B9F"; // ↓
    } else {
        increaseArrow.setAttribute("x", (width * size) + 2 * size);
        increaseArrow.setAttribute("y", (height * size) / 2 + size / 4);
        increaseArrow.textContent = "\u2B9E"; // →
    }
    increaseArrow.onmouseover = highlightIncreaseArrow;
    increaseArrow.onmouseout = fadeIncreaseArrow;
    increaseArrow.onclick = increaseSize;
    document.getElementById("arrows").appendChild(increaseArrow);
}
//#endregion

//#region Event Functions
function highlightSquare(evt) {
    var id = evt.target.getAttribute("id");
    id = id.replace("square_aux_", "");
    var idSplited = id.split('.');
    var i = parseInt(idSplited[0]);
    var j = parseInt(idSplited[1]);
    if (i < width && j < height) {
        var verticalLine = document.getElementById("line_0." + i);
        verticalLine.setAttribute("stroke", $RULE_COLOR);
        if ((i % multiple) != 0)
            verticalLine.setAttribute("stroke-width", "2");
        i = i + 1;
        verticalLine = document.getElementById("line_0." + i);
        verticalLine.setAttribute("stroke", $RULE_COLOR);
        if ((i % multiple) != 0)
            verticalLine.setAttribute("stroke-width", "2");
        var horizontalLine = document.getElementById("line_1." + j);
        horizontalLine.setAttribute("stroke", $RULE_COLOR);
        if ((j % multiple) != 0)
            horizontalLine.setAttribute("stroke-width", "2");
        j = j + 1;
        horizontalLine = document.getElementById("line_1." + j);
        horizontalLine.setAttribute("stroke", $RULE_COLOR);
        if ((j % multiple) != 0)
            horizontalLine.setAttribute("stroke-width", "2");
    }
}

function fadeSquare(evt) {
    var id = evt.target.getAttribute("id");
    id = id.replace("square_aux_", "");
    var idSplited = id.split('.');
    var i = parseInt(idSplited[0]);
    var j = parseInt(idSplited[1]);
    if (i < width && j < height) {
        var verticalLine = document.getElementById("line_0." + i);
        verticalLine.setAttribute("stroke", $LINE_COLOR);
        if ((i % multiple) != 0)
            verticalLine.setAttribute("stroke-width", "1");
        i = i + 1;
        verticalLine = document.getElementById("line_0." + i);
        verticalLine.setAttribute("stroke", $LINE_COLOR);
        if ((i % multiple) != 0)
            verticalLine.setAttribute("stroke-width", "1");
        var horizontalLine = document.getElementById("line_1." + j);
        horizontalLine.setAttribute("stroke", $LINE_COLOR);
        if ((j % multiple) != 0)
            horizontalLine.setAttribute("stroke-width", "1");
        j = j + 1;
        horizontalLine = document.getElementById("line_1." + j);
        horizontalLine.setAttribute("stroke", $LINE_COLOR);
        if ((j % multiple) != 0)
            horizontalLine.setAttribute("stroke-width", "1");
    }
}

function initColorsChange(evt) {
    if (evt.button == 0) {
        var id = evt.target.getAttribute("id");
        id = id.replace("square_aux_", "");
        var idSplited = id.split('.');
        squareI = parseInt(idSplited[0]);
        squareJ = parseInt(idSplited[1]);
        var square = document.getElementById("square_" + squareI + "." + squareJ);
        if (squareI < width && squareJ < height) {
            colorSquare = square.getAttribute("fill");
            if (colorSquare == $BACKGROUND_COLOR) {
                square.setAttribute("fill", currentColor);
                square.setAttribute("opacity", "1");
                colorSquare = currentColor;
            } else {
                if (colorSquare == currentColor) {
                    square.setAttribute("fill", $BACKGROUND_COLOR);
                    square.setAttribute("opacity", "0");
                    colorSquare = $BACKGROUND_COLOR;
                } else {
                    square.setAttribute("fill", currentColor);
                    colorSquare = currentColor;
                }
            }
            clicked = true;
        }
    }
}

function changeColorSquares(evt) {
    if (clicked) {
        var id = evt.target.getAttribute("id");
        id = id.replace("square_aux_", "");
        var idSplited = id.split('.');
        var i = parseInt(idSplited[0]);
        var j = parseInt(idSplited[1]);
        var count;
        cleanAllSquaresAux();
        if ((i > squareI) && (j == squareJ)) {
            count = squareI;
            while (count <= i) {
                if (count < width) {
                    refreshSquareAux(count, squareJ);
                }
                count++;
            }
        }
        else if ((i < squareI) && (j == squareJ)) {
            count = i;
            while (count <= squareI) {
                refreshSquareAux(count, squareJ);
                count++;
            }
        }
        else if ((i == squareI) && (j > squareJ)) {
            count = squareJ;
            while (count <= j) {
                if (count < height) {
                    refreshSquareAux(squareI, count);
                }
                count++;
            }
        }
        else if ((i == squareI) && (j < squareJ)) {
            count = j;
            while (count <= squareJ) {
                refreshSquareAux(squareI, count);
                count++;
            }
        }
    }
}

function highlightDecreaseArrow(evt) {
    evt.target.setAttribute("opacity", "1");
}

function fadeDecreaseArrow(evt) {
    evt.target.setAttribute("opacity", "0.5");
}

function decreaseSize(evt) {
    var id = evt.target.getAttribute("id");
    var orientation = id.replace("decrease_arrow_", "");
    if (orientation == 0) {
        height -= multiple;
        if (height < $MIN_DIMENSION)
            height += multiple;
    } else {
        width -= multiple;
        if (width < $MIN_DIMENSION)
            width += multiple;
    }
    refresh();
}

function highlightIncreaseArrow(evt) {
    evt.target.setAttribute("opacity", "1");
}

function fadeIncreaseArrow(evt) {
    evt.target.setAttribute("opacity", "0.5");
}

function increaseSize(evt) {
    var id = evt.target.getAttribute("id");
    var orientation = id.replace("increase_arrow_", "");
    if (orientation == 0) {
        height += multiple;
        if (height > $MAX_HEIGTH_DIMENSION)
            height -= multiple;
    } else {
        width += multiple;
        if (width > $MAX_WIDTH_DIMENSION)
            width -= multiple;
    }
    refresh();
}
//#endregion
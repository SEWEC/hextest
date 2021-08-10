window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    const img = document.getElementById("texture");
    const pat = ctx.createPattern(img, "repeat");
    
    var hexGrid = [];

    function generateHexGrid(callBack){
        let xLen = Math.ceil((document.body.clientWidth + 50)/150);
        let yLen = Math.ceil((document.body.clientHeight + 50 * Math.sqrt(3)/2)/(50 * Math.sqrt(3)/2));
        for(y = 0; y <= yLen; y++){
            hexGrid.push(new Array(xLen).fill(0));
        }
        hexGrid.forEach((row,indexRow) => {
            row.forEach((column,indexColumn) => {
                hexGrid[indexRow][indexColumn] = Math.floor(Math.random()*3);
            })
        })
        callBack();
    }

    generateHexGrid(setSizing);
    function createHexagons(grads,callBack){
        hexGrid.forEach((row,rowIndex) => {
            row.forEach((column, columnIndex) => {
                let x = (rowIndex%2==0) ? columnIndex * 150 : columnIndex * 150 + 75;
                let y = rowIndex * 50 * Math.sqrt(3)/2;
                drawHex({x:x,y:y}, 50.5, grads[hexGrid[rowIndex][columnIndex]]);
                addHighlights(rowIndex, columnIndex, {x:x,y:y}, 50.5);
            })
        })
        hexGrid.forEach((row,rowIndex) => {
            row.forEach((column, columnIndex) => {
                let x = (rowIndex%2==0) ? columnIndex * 150 : columnIndex * 150 + 75;
                let y = rowIndex * 50 * Math.sqrt(3)/2;
                addShadows(rowIndex, columnIndex, {x:x,y:y}, 50.5);
            })
        })
        callBack();
    }

    function addHighlights(rowIndex, columnIndex, center, radius){
        for(i = 0; i < 3; i++){
            let adjacent = getAdjacent(rowIndex,columnIndex,i);
            if(getColor(adjacent[0],adjacent[1]) != hexGrid[rowIndex][columnIndex]){
                drawHighlight(center,radius,i);
            }
        }
    }

    function addShadows(rowIndex, columnIndex, center, radius){
        for(i = 3; i < 6; i++){
            let adjacent = getAdjacent(rowIndex,columnIndex,i);
            if(getColor(adjacent[0],adjacent[1]) < hexGrid[rowIndex][columnIndex]){
                drawShadow(center,radius,i);
            }
        }
    }
    
    function drawHighlight(center,radius,direction){
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let point = getDirectionPoint(center,radius - radius/25,direction);
        ctx.moveTo(point.x , point.y);
        point = getDirectionPoint(center,radius - radius/25, (direction+1)%6);
        ctx.lineTo(point.x , point.y);
        ctx.stroke();
    }

    function drawShadow(center,radius,direction){
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let point = getDirectionPoint(center,radius + .5 ,direction);
        ctx.moveTo(point.x , point.y);
        point = getDirectionPoint(center,radius + .5, (direction+1)%6);
        ctx.lineTo(point.x , point.y);
        ctx.stroke();
    }

    function setSizing()
    {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
        var orangeGrad = ctx.createLinearGradient(0, 0, 0, document.body.clientHeight);
        orangeGrad.addColorStop(1, "#F87638");
        orangeGrad.addColorStop(0, "#F87A3D");
        var yellowGrad = ctx.createLinearGradient(0, 0, 0, document.body.clientHeight);
        yellowGrad.addColorStop(1, "#FDBB43");
        yellowGrad.addColorStop(0, "#FDCD45");
        var blueGrad = ctx.createLinearGradient(0, 0, 0, document.body.clientHeight);
        blueGrad.addColorStop(1, "#7CB7D9");
        blueGrad.addColorStop(0, "#7EB9E1");
        var grads = [blueGrad,yellowGrad,orangeGrad];
        createHexagons(grads,() => {
            ctx.globalAlpha = .075;
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = pat;
            ctx.fill(); 
            ctx.globalAlpha = 1;
        });
    }

    window.onresize = () => setSizing();

    function drawHex(center, radius, color){
        ctx.fillStyle = color;
        ctx.beginPath();
        let point = getDirectionPoint(center, radius, 0);
        ctx.moveTo(point.x, point.y);
        for(i = 1; i < 6; i++){
            point = getDirectionPoint(center, radius, i);
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.fill();
    }

    function getAdjacent(row, column, direction){
        let xOffset = 0;
        let yOffset = 0;
        switch (direction){
            case 0:
                xOffset = row%2;
                yOffset = -1;
                break;
            case 1:
                yOffset = -2;
                break;
            case 2:
                xOffset = -(row+1)%2;
                yOffset = -1;
                break;
            case 3:
                xOffset = -(row+1)%2;
                yOffset = 1;
                break;
            case 4:
                yOffset = 2;
                break;
            case 5:
                xOffset = row%2;
                yOffset = 1;
                break;
        }
        return [row + yOffset, column + xOffset];
    }

    function getColor(row,column){
        if(row < hexGrid.length && row >= 0 && column < hexGrid[0].length && column >= 0){
            return hexGrid[row][column];
        }
        else{
            return -1;
        }
    }

    function getDirectionPoint(center,radius,direction){
        let x = center.x;
        let y = center.y;
        switch (direction){
            case 0:
                x += radius;
                break;
            case 1:
                x += radius/2;
                y -= radius * Math.sqrt(3)/2;
                break;
            case 2:
                x -= radius/2;
                y -= radius * Math.sqrt(3)/2;
                break;
            case 3:
                x -= radius;
                break;
            case 4:
                x -= radius/2;
                y += radius * Math.sqrt(3)/2;
                break;
            case 5:
                x += radius/2;
                y += radius * Math.sqrt(3)/2;
                break;
        }
        return {x:x,y:y};
    }
}



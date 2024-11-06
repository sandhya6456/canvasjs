const canvas = document.getElementById('maincontainer');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetbutton');

const circleRadius = 35;
const circleSpacing = 550;
const arrowWidth = 17;
const arrowHeight = 25;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const originalColors = ['Red', 'blue', 'yellow', 'Orange'];

let circles = [];
let arrows = [];
let isVisible = [true, true, true, true]; 

function circledraw(x, y, color) {
    
    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'black'; 
    ctx.lineWidth = 3; 
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(x, y, circleRadius - 1.5, 0, Math.PI * 2); 
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawarrow(x, y, isVisible) {
    if (isVisible) {
        var rwidth = 40; 
        var rh = 9;
        var tx1 = x - arrowWidth / 2;
        var ty1 = y ;
        var tx2 = x + arrowWidth / 2;
        var ty2 = y + arrowHeight / 2;
        var tx3 = x + arrowWidth / 2;
        var ty3 = y - arrowHeight / 2;
        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
        ctx.lineTo(tx3, ty3);
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.fillRect(x + arrowWidth / 2, y - rh / 2, rwidth, rh);
    }
}

function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const circleSpacingY = 8;
    for (let i = 0; i < 4; i++) {
        const circleX = canvasWidth / 9;
        const circleY = (canvasHeight / 5) * (i + 1) + (circleSpacingY * i); 
        const arrowX = circleX + (circleRadius * 2) + circleSpacing;
        const arrowY = circleY;
        circledraw(circleX, circleY, originalColors[i]);
        drawarrow(arrowX, arrowY, isVisible[i]);
        circles.push({ x: circleX, y: circleY, color: originalColors[i] });
        arrows.push({ x: arrowX, y: arrowY });
    }
}

function reset() {
    circles = [];
    arrows = [];
    isVisible = [true, true, true, true]; 
    main();
}

function checkCollision(arrowX, arrowY) {
    for (const circle of circles) {
        const distance = Math.sqrt((arrowX - circle.x) ** 2 + (arrowY - circle.y) ** 2);
        if (distance <= circleRadius + arrowWidth / 2) {
            return circle;
        }
    }
    return null;
}

canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedCircle = checkCollision(x, y);
    if (clickedCircle) {
        const arrowIndex = circles.findIndex(circle => circle === clickedCircle);
        const arrow = arrows[arrowIndex];

        let arrowX = arrow.x;
        let arrowY = arrow.y;

        isVisible[arrowIndex] = false; 

        let interval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            main(); 
            arrowX -= (arrowX - clickedCircle.x) / 10;
            drawarrow(arrowX, arrowY, true); 
            const collisionCircle = checkCollision(arrowX, arrowY);
            if (collisionCircle && collisionCircle === clickedCircle) {
                clearInterval(interval);
                const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); // Here I am generating random colour
                ctx.clearRect(clickedCircle.x - circleRadius, clickedCircle.y - circleRadius, circleRadius * 2, circleRadius * 2);
                circledraw(clickedCircle.x, clickedCircle.y, randomColor);
                clickedCircle.color = randomColor;
                isVisible[arrowIndex] = true; 
            }
            // arrowtip should touch the circle boundary
            const arrowTipX = arrowX + arrowLength * Math.cos(arrowAngle);  
            const arrowTipY = arrowY + arrowLength * Math.sin(arrowAngle);
            
            const distance = Math.sqrt((arrowTipX - clickedCircle.x) ** 2 + (arrowTipY - clickedCircle.y) ** 2);
            if (distance <= circleRadius + arrowWidth / 2) {
                clearInterval(interval);
            }
        }, 10);
    }
});

resetButton.addEventListener('click', reset);

main();
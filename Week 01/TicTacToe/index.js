let color = 1;
let pattern = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];
let board = document.querySelector('#board');

// 渲染
function render(pattern) {
    let template = pattern.map((line, i) => {
        let cells = pattern[i].map((cell, j) => {
            return getCell(i, j, cell);
        }).join('');
        return getLine(i, cells);
    }).join('');

    board.innerHTML = template;
}

// 生成行
function getLine(i, cells) {
    return `<div data-id="${i}">${cells}</div>`
}

// 生成单元格
function getCell(i, j, value) {
    let icon = value === 0 ? '' : value === 1 ? '⭕' : '❌';
    return `<div data-id="${i}-${j}" class="cell">${icon}</div>`
}

// 玩家落子
function userMove(e) {
    let target = e.target;
    let cellId = target.dataset.id;
    let [i, j] = cellId.split('-');

    if (pattern[i][j]) return;

    pattern[i][j] = color;
    color = 3 - color;
    render(pattern);

    if (!isWin(pattern)) {
        computerMove();
    }
}

// 电脑落子
function computerMove() {
    let { point } = bestChoice(pattern, color);
    if (!point) {
        reset();
        return;
    }

    let [i, j] = point;

    pattern[i][j] = color;
    color = 3 - color;
    render(pattern);
    isWin(pattern);
}

// 是否胜利
function isWin(pattern) {
    if (check(pattern)) {
        let icon = color === 2 ? '⭕' : '❌';
        alert(`Winner is ${icon}!`);
        reset();
        return true;
    }
    if (willWin(pattern, color)) {
        let icon = color === 1 ? '⭕' : '❌';
        console.log(`${icon} will win!`);
    }
    return false;
}

// 判断胜负
function check(pattern) {
    {
        let win = pattern.some(line => {
            return line[0] && line[0] === line[1] && line[0] === line[2];
        });
        if (win) {
            return true;
        }
    }
    {
        let win = pattern[0].some((cell, j) => {
            return cell && cell === pattern[1][j] && cell === pattern[2][j];
        });
        if (win) {
            return true;
        }
    }
    {
        let win = pattern[0][0]
            && pattern[0][0] === pattern[1][1]
            && pattern[0][0] === pattern[2][2];
        if (win) {
            return true;
        }
    }
    {
        let win = pattern[2][0]
            && pattern[2][0] === pattern[1][1]
            && pattern[2][0] === pattern[0][2];
        if (win) {
            return true;
        }
    }
}

// 初始化
function reset() {
    pattern = pattern.map(line => pattern.map(cell => 0));
    render(pattern);
}

// 克隆
function clone(pattern) {
    return JSON.parse(JSON.stringify(pattern));
}

// 是否将要赢
function willWin(pattern, color) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (pattern[i][j]) {
                continue;
            }
            let tmp = clone(pattern);
            tmp[i][j] = color;
            if (check(tmp)) {
                return [i, j];
            }

        }
    }
    return null;
}

// 找出最好选择
function bestChoice(pattern, color) {
    let point = willWin(pattern, color);
    if (point) {
        return {
            point,
            result: 1
        }
    }
    let result = -2;

    outer: for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (pattern[i][j]) {
                continue;
            }
            let tmp = clone(pattern);
            tmp[i][j] = color;

            let r = bestChoice(tmp, 3 - color);
            if (-r.result >= result) {
                result = -r.result;
                point = [i, j];
            }
            if (result === 1) {
                break outer;
            }

        }
    }
    return {
        point,
        result: point ? result : 0
    }
}

render(pattern);
board.addEventListener('click', userMove);

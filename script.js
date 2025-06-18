// Файл: script.js — содержит логику калькулятора

// Класс для решения задач линейного программирования (упрощенная версия)
// Объявление класса для решения методом симплекс
class SimplexSolver {
    constructor() {
        this.tolerance = 1e-8;
    }

    // Решение задачи максимизации для игрока A
    solvePlayerA(payoffMatrix) {
        const m = payoffMatrix.length;
        const n = payoffMatrix[0].length;
        
        // Преобразуем в стандартную форму
        // Переменные: x1, x2, ..., xm, v
        // Ограничения: сумма xi = 1, xi >= 0
        // Для каждого столбца j: сумма(xi * aij) >= v
        
        // Используем приближенный метод для демонстрации
        const result = this.approximateSolution(payoffMatrix, true);
        return result;
    }

    // Решение задачи минимизации для игрока B
    solvePlayerB(payoffMatrix) {
        const result = this.approximateSolution(payoffMatrix, false);
        return result;
    }

    // Приближенное решение методом итераций
    approximateSolution(payoffMatrix, isPlayerA) {
        const m = payoffMatrix.length;
        const n = payoffMatrix[0].length;
        
        if (isPlayerA) {
            // Для игрока A: найти стратегию, которая максимизирует минимальный выигрыш
            let bestStrategy = new Array(m).fill(1/m);
            let bestValue = -Infinity;
            
            // Перебираем различные комбинации стратегий
            for (let iter = 0; iter < 1000; iter++) {
                const strategy = this.generateRandomStrategy(m);
                const minValue = this.calculateMinExpectedValue(payoffMatrix, strategy);
                
                if (minValue > bestValue) {
                    bestValue = minValue;
                    bestStrategy = [...strategy];
                }
            }
            
            return {
                strategy: bestStrategy,
                value: bestValue
            };
        } else {
            // Для игрока B: найти стратегию, которая минимизирует максимальный проигрыш
            let bestStrategy = new Array(n).fill(1/n);
            let bestValue = Infinity;
            
            for (let iter = 0; iter < 1000; iter++) {
                const strategy = this.generateRandomStrategy(n);
                const maxValue = this.calculateMaxExpectedValue(payoffMatrix, strategy);
                
                if (maxValue < bestValue) {
                    bestValue = maxValue;
                    bestStrategy = [...strategy];
                }
            }
            
            return {
                strategy: bestStrategy,
                value: bestValue
            };
        }
    }

    generateRandomStrategy(size) {
        const strategy = new Array(size);
        let sum = 0;
        
        for (let i = 0; i < size; i++) {
            strategy[i] = Math.random();
            sum += strategy[i];
        }
        
        // Нормализуем
        for (let i = 0; i < size; i++) {
            strategy[i] /= sum;
        }
        
        return strategy;
    }

    calculateMinExpectedValue(payoffMatrix, strategyA) {
        const n = payoffMatrix[0].length;
        let minValue = Infinity;
        
        for (let j = 0; j < n; j++) {
            let expectedValue = 0;
            for (let i = 0; i < payoffMatrix.length; i++) {
                expectedValue += strategyA[i] * payoffMatrix[i][j];
            }
            minValue = Math.min(minValue, expectedValue);
        }
        
        return minValue;
    }

    calculateMaxExpectedValue(payoffMatrix, strategyB) {
        const m = payoffMatrix.length;
        let maxValue = -Infinity;
        
        for (let i = 0; i < m; i++) {
            let expectedValue = 0;
            for (let j = 0; j < payoffMatrix[0].length; j++) {
                expectedValue += strategyB[j] * payoffMatrix[i][j];
            }
            maxValue = Math.max(maxValue, expectedValue);
        }
        
        return maxValue;
    }
}

// Глобальные переменные
let currentRows = 4;
let currentCols = 4;
let solver = new SimplexSolver();

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
// Создание матрицы ввода
    createMatrix(currentRows, currentCols);
    loadExampleMatrix();
});

// Создание матрицы ввода
// Функция: function createMatrix(rows, cols) {
function createMatrix(rows, cols) {
    const container = document.getElementById('matrixInput');
    container.innerHTML = '';
    
    // Создаем подписи столбцов
    const columnLabels = document.getElementById('columnLabels');
    columnLabels.innerHTML = '';
    for (let j = 0; j < cols; j++) {
        const label = document.createElement('div');
        label.className = 'column-label';
        label.textContent = `B${j + 1}`;
        columnLabels.appendChild(label);
    }
    
    // Создаем подписи строк
    const rowLabels = document.getElementById('rowLabels');
    rowLabels.innerHTML = '';
    for (let i = 0; i < rows; i++) {
        const label = document.createElement('div');
        label.className = 'row-label';
        label.textContent = `A${i + 1}`;
        rowLabels.appendChild(label);
    }
    
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'matrix-row';
        
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-cell';
            input.id = `cell_${i}_${j}`;
            input.value = '0';
            input.addEventListener('focus', function() {
                this.select();
            });
            row.appendChild(input);
        }
        
        container.appendChild(row);
    }
}

// Изменение размера матрицы
// Функция: function changeMatrixSize(newRows, newCols) {
function changeMatrixSize(newRows, newCols) {
    // Обновляем активную кнопку
    document.querySelectorAll('.preset-buttons button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    currentRows = newRows;
    currentCols = newCols;
    
    // Обновляем поля ввода
    document.getElementById('rowsInput').value = newRows;
    document.getElementById('colsInput').value = newCols;
    
// Создание матрицы ввода
    createMatrix(newRows, newCols);
    
    // Скрываем результаты
    document.getElementById('resultsSection').style.display = 'none';
}

// Обновление размера матрицы из полей ввода
// Функция: function updateMatrixSize() {
function updateMatrixSize() {
    const rows = parseInt(document.getElementById('rowsInput').value);
    const cols = parseInt(document.getElementById('colsInput').value);
    
    // Валидация
    if (rows < 2) document.getElementById('rowsInput').value = 2;
    if (cols < 2) document.getElementById('colsInput').value = 2;
    if (rows > 10) document.getElementById('rowsInput').value = 10;
    if (cols > 10) document.getElementById('colsInput').value = 10;
}

// Применение пользовательского размера
// Функция: function applyCustomSize() {
function applyCustomSize() {
    const rows = parseInt(document.getElementById('rowsInput').value);
    const cols = parseInt(document.getElementById('colsInput').value);
    
    if (rows >= 2 && cols >= 2 && rows <= 10 && cols <= 10) {
        // Убираем активное состояние с preset кнопок
        document.querySelectorAll('.preset-buttons button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        currentRows = rows;
        currentCols = cols;
// Создание матрицы ввода
        createMatrix(rows, cols);
        
        // Скрываем результаты
        document.getElementById('resultsSection').style.display = 'none';
    } else {
        alert('Размер матрицы должен быть от 2×2 до 10×10');
    }
}

// Загрузка примера матрицы
// Функция: function loadExampleMatrix() {
function loadExampleMatrix() {
    const example = [
        [4, 7, 10, 11],
        [2, 5, 3, 1],
        [6, 3, 1, 1],
        [5, 2, 4, 8]
    ];
    
    for (let i = 0; i < Math.min(currentRows, example.length); i++) {
        for (let j = 0; j < Math.min(currentCols, example[i].length); j++) {
            const cell = document.getElementById(`cell_${i}_${j}`);
            if (cell) {
                cell.value = example[i][j];
            }
        }
    }
}

// Получение матрицы из интерфейса
// Функция: function getPayoffMatrix() {
function getPayoffMatrix() {
    const matrix = [];
    
    for (let i = 0; i < currentRows; i++) {
        const row = [];
        for (let j = 0; j < currentCols; j++) {
            const cell = document.getElementById(`cell_${i}_${j}`);
            const value = parseFloat(cell.value) || 0;
            row.push(value);
        }
        matrix.push(row);
    }
    
    return matrix;
}

// Основная функция расчета
// Расчет оптимальных стратегий для обоих игроков
async function calculateStrategies() {
    const button = document.querySelector('.calculate-btn');
    const originalText = button.textContent;
    
    // Показываем индикатор загрузки
    button.innerHTML = 'Вычисляем... <span class="loading"></span>';
    button.disabled = true;
    
    try {
        // Небольшая задержка для демонстрации
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const payoffMatrix = getPayoffMatrix();
        
        // Решаем задачи для обоих игроков
        const resultA = solver.solvePlayerA(payoffMatrix);
        const resultB = solver.solvePlayerB(payoffMatrix);
        
        // Цена игры - среднее значение
        const gameValue = (resultA.value + resultB.value) / 2;
        
        displayResults(resultA.strategy, resultB.strategy, gameValue);
        
        // Показываем секцию результатов с анимацией
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Ошибка при вычислении:', error);
        alert('Произошла ошибка при вычислении. Проверьте корректность данных.');
    } finally {
        // Восстанавливаем кнопку
        button.textContent = originalText;
        button.disabled = false;
    }
}

// Отображение результатов
// Функция: function displayResults(strategyA, strategyB, gameValue) {
function displayResults(strategyA, strategyB, gameValue) {
    // Цена игры
    document.getElementById('gameValue').textContent = gameValue.toFixed(4);
    
    // Получаем матрицу для расчетов
    const payoffMatrix = getPayoffMatrix();
    
    // Стратегия игрока A
    displayStrategy('strategyA', 'chartA', strategyA, 'A');
    displayExpectationCalculation('expectationA', strategyA, payoffMatrix, 'A');
    
    // Стратегия игрока B
    displayStrategy('strategyB', 'chartB', strategyB, 'B');
    displayExpectationCalculation('expectationB', strategyB, payoffMatrix, 'B');
}

// Отображение одной стратегии
// Функция: function displayStrategy(tableId, chartId, strategy, player) {
function displayStrategy(tableId, chartId, strategy, player) {
    // Таблица
    const tableContainer = document.getElementById(tableId);
    let tableHTML = '<table><thead><tr><th>Стратегия</th><th>Вероятность</th><th>%</th></tr></thead><tbody>';
    
    for (let i = 0; i < strategy.length; i++) {
        const prob = strategy[i];
        const percent = (prob * 100).toFixed(2);
        tableHTML += `<tr>
            <td>${player}${i + 1}</td>
            <td>${prob.toFixed(4)}</td>
            <td>${percent}%</td>
        </tr>`;
    }
    
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
    
    // График
    displayChart(chartId, strategy, player);
}

// Новая функция для отображения расчета математического ожидания
// Функция: function displayExpectationCalculation(containerId, strategy, payoffMatrix, player) {
function displayExpectationCalculation(containerId, strategy, payoffMatrix, player) {
    const container = document.getElementById(containerId);
    
    if (player === 'A') {
        // Для игрока A: находим минимальное ожидание по всем столбцам
        let minExpectation = Infinity;
        let worstColumnIndex = -1;
        let calculations = [];
        
        for (let j = 0; j < payoffMatrix[0].length; j++) {
            let expectation = 0;
            let calculationParts = [];
            
            for (let i = 0; i < payoffMatrix.length; i++) {
                const value = payoffMatrix[i][j] * strategy[i];
                expectation += value;
                if (strategy[i] > 0.0001) { // Показываем только значимые вероятности
                    calculationParts.push(`${payoffMatrix[i][j]}×${strategy[i].toFixed(4)}`);
                }
            }
            
            calculations.push({
                column: j,
                expectation: expectation,
                calculation: calculationParts.join(' + ')
            });
            
            if (expectation < minExpectation) {
                minExpectation = expectation;
                worstColumnIndex = j;
            }
        }
        
        let html = '<div class="expectation-title">Математическое ожидание против каждой стратегии B:</div>';
        html += '<div class="expectation-list">';
        
        calculations.forEach((calc, index) => {
            const isWorst = index === worstColumnIndex;
            html += `<div class="expectation-item ${isWorst ? 'worst-case' : ''}">
                <strong>Против B${calc.column + 1}:</strong> ${calc.calculation} = ${calc.expectation.toFixed(4)}
                ${isWorst ? ' <span class="worst-label">(худший случай)</span>' : ''}
            </div>`;
        });
        
        html += '</div>';
        html += `<div class="expectation-summary">Гарантированный выигрыш: <strong>${minExpectation.toFixed(4)}</strong></div>`;
        
        container.innerHTML = html;
        
    } else {
        // Для игрока B: находим максимальное ожидание по всем строкам
        let maxExpectation = -Infinity;
        let worstRowIndex = -1;
        let calculations = [];
        
        for (let i = 0; i < payoffMatrix.length; i++) {
            let expectation = 0;
            let calculationParts = [];
            
            for (let j = 0; j < payoffMatrix[0].length; j++) {
                const value = payoffMatrix[i][j] * strategy[j];
                expectation += value;
                if (strategy[j] > 0.0001) { // Показываем только значимые вероятности
                    calculationParts.push(`${payoffMatrix[i][j]}×${strategy[j].toFixed(4)}`);
                }
            }
            
            calculations.push({
                row: i,
                expectation: expectation,
                calculation: calculationParts.join(' + ')
            });
            
            if (expectation > maxExpectation) {
                maxExpectation = expectation;
                worstRowIndex = i;
            }
        }
        
        let html = '<div class="expectation-title">Математическое ожидание против каждой стратегии A:</div>';
        html += '<div class="expectation-list">';
        
        calculations.forEach((calc, index) => {
            const isWorst = index === worstRowIndex;
            html += `<div class="expectation-item ${isWorst ? 'worst-case' : ''}">
                <strong>Против A${calc.row + 1}:</strong> ${calc.calculation} = ${calc.expectation.toFixed(4)}
                ${isWorst ? ' <span class="worst-label">(худший случай)</span>' : ''}
            </div>`;
        });
        
        html += '</div>';
        html += `<div class="expectation-summary">Максимальный проигрыш: <strong>${maxExpectation.toFixed(4)}</strong></div>`;
        
        container.innerHTML = html;
    }
}

// Отображение диаграммы
// Функция: function displayChart(chartId, strategy, player) {
function displayChart(chartId, strategy, player) {
    const chartContainer = document.getElementById(chartId);
    chartContainer.innerHTML = '';
    
    const maxValue = Math.max(...strategy);
    const maxHeight = 150;
    
    for (let i = 0; i < strategy.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        
        const height = (strategy[i] / maxValue) * maxHeight;
        bar.style.height = `${height}px`;
        
        // Подпись снизу
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = `${player}${i + 1}`;
        bar.appendChild(label);
        
        // Значение сверху
        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = strategy[i].toFixed(3);
        bar.appendChild(value);
        
        chartContainer.appendChild(bar);
    }
}

// Добавляем обработчики клавиатуры для удобства
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('matrix-cell')) {
        // Переход к следующей ячейке при нажатии Enter
        const currentId = e.target.id;
        const [, i, j] = currentId.split('_').map(Number);
        
        let nextI = i;
        let nextJ = j + 1;
        
        if (nextJ >= currentCols) {
            nextJ = 0;
            nextI = i + 1;
        }
        
        if (nextI < currentRows) {
            const nextCell = document.getElementById(`cell_${nextI}_${nextJ}`);
            if (nextCell) {
                nextCell.focus();
                nextCell.select();
            }
        }
    }
});

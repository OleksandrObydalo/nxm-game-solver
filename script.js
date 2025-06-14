// Класс для решения задач линейного программирования (упрощенная версия)
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
    createMatrix(currentRows, currentCols);
    loadExampleMatrix();
});

// Создание матрицы ввода
function createMatrix(rows, cols) {
    const container = document.getElementById('matrixInput');
    container.innerHTML = '';
    
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
    
    createMatrix(newRows, newCols);
    
    // Скрываем результаты
    document.getElementById('resultsSection').style.display = 'none';
}

// Обновление размера матрицы из полей ввода
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
        createMatrix(rows, cols);
        
        // Скрываем результаты
        document.getElementById('resultsSection').style.display = 'none';
    } else {
        alert('Размер матрицы должен быть от 2×2 до 10×10');
    }
}

// Загрузка примера матрицы
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
function displayResults(strategyA, strategyB, gameValue) {
    // Цена игры
    document.getElementById('gameValue').textContent = gameValue.toFixed(4);
    
    // Стратегия игрока A
    displayStrategy('strategyA', 'chartA', strategyA, 'A');
    
    // Стратегия игрока B
    displayStrategy('strategyB', 'chartB', strategyB, 'B');
}

// Отображение одной стратегии
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

// Отображение диаграммы
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
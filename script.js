const generateId = () => `calc ${Math.round(Math.random() * 1e8).toString(16)}`
const  totalBalance = document.querySelector('.total__balance'),
        totalMoneyIncome = document.querySelector('.total__money-income'),
        totalMoneyExpenses = document.querySelector('.total__money-expenses'),
        historyList = document.querySelector('.history__list'),
        form = document.querySelector('#form'),
        operationName = document.querySelector('.operation__name'),
        operationAmount = document.querySelector('.operation__amount');

let dataBaseOperation = JSON.parse(localStorage.getItem('calc')) || [];

// localStorage.clear();

// if (localStorage.getItem('calc')) {
//     dataBaseOperation = JSON.parse(localStorage.getItem('calc'));
// }

const renderOperation = (operation) => { //создаем строкку с расходами 
    const className = operation.amount < 0 ? 
        'history__item-minus' : 
        'history__item-plus';
    const listItem = document.createElement('li');
    listItem.classList.add('history__item');
    listItem.classList.add(className);
    listItem.innerHTML = ` ${operation.description}
        <span class="history__money">${operation.amount} ₽</span>
        <button class="history__delete" data-id='${operation.id}'">x</button>
    `;
    historyList.append(listItem); //добавляет на страницу
};

const updateBalance = () => {
    const resultIncome = dataBaseOperation
        .filter((item) =>  item.amount > 0) //принимает ф-цию, возвращает тру\фолз  и тру соберется в новый массив
        .reduce((result, item) => result + item.amount, 0); 
    const resultExpenses = dataBaseOperation
        .filter((item) => item.amount < 0)
        .reduce((result, item) => result + item.amount, 0); 

    totalMoneyIncome.textContent = resultIncome;
    totalMoneyExpenses.textContent = resultExpenses;
    totalBalance.textContent = (resultIncome + resultExpenses) + ' ₽';
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const operationNameValue = operationName.value;
    const operationAmauntValue = operationAmount.value;

    operationName.style.borderColor = ''; //меняем стиль если до этого был поменян
    operationAmount.style.borderColor = '';
    //проверяем что не пустые
    if (operationNameValue && operationAmauntValue) {
        //добавление в массив
  
        const  operation = {
            id: generateId(),
            description: operationNameValue,
            amount: +operationAmauntValue,
        }

        dataBaseOperation.push(operation);
        init();


    } else {
        if (!operationNameValue) {
            operationName.style.borderColor = 'red';
        } 
        if (!operationAmauntValue) {
            operationAmount.style.borderColor = 'red';
        } 
    }
    //очистка полей
    operationName.value = '';
    operationAmount.value = '';
});

const deleteOperation = (event) => {
    const target = event.target;
    console.log('event.target', event.target)
    if (target.classList.contains('history__delete')) {
        dataBaseOperation = dataBaseOperation
            .filter(operation => operation.id !== target.dataset.id);
            console.log('target.dataset.id', target.dataset.id)
        
        init();
    }
};

const init = () => {
    historyList.textContent = '';

    dataBaseOperation.forEach((item, idx, arr) => {
        // console.log(item);
        renderOperation(item);
    });
    updateBalance();
    localStorage.setItem('calc', JSON.stringify(dataBaseOperation));
}; 

historyList.addEventListener('click', deleteOperation); 

init();
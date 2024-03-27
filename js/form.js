import { fetchData } from "./fetchData.js";
const form = document.querySelector('.form');
const fieldsets = form.querySelectorAll('.form__fieldset');
const buttons = form.querySelectorAll('.form__btn');
const formType = form.querySelector('.form__radio-wrapper--type');
const formMonths = form.querySelector('.form__months');
const formDay = form.querySelector('.form__radio-wrapper--day');
const formTime = form.querySelector('.form__radio-wrapper--time');
const formInfoType = form.querySelector('.form__info--type');
const formInfoData = form.querySelector('.form__info-data');

let currentStep = 0;
const currentMonth = new Intl.DateTimeFormat('ru-Ru', {month: 'long'}).format(new Date())
let month = currentMonth;

const data = await fetchData();

const init = () => {

    const findBtn = (id) => {
        let button = null;
        buttons.forEach((item)=> {
            if (item.getAttribute('data-id') === id) {
                button = item;
            }
        })
        return button;
    };

    const setButtonsDisabled = () => {
        const isValid = validateForm();
        findBtn('next').disabled = !isValid;
        findBtn('submit').disabled = isValid;
        findBtn('next').classList.add('form__btn-active');
        findBtn('prev').classList.add('form__btn-active');

        if (currentStep === fieldsets.length - 1) {
            findBtn('submit').classList.add('form__btn-active');
            findBtn('next').classList.remove('form__btn-active');
            showResultData();
        } else {
            findBtn('submit').classList.remove('form__btn-active');
        }

        if(currentStep === 0) {
            findBtn('prev').classList.remove('form__btn-active');
        }
    };

    const updateVisibility = (id) => {
        document.body.classList.remove('form--active');
            fieldsets.forEach((fieldset, index) => {
                if (currentStep === index) {
                    fieldset.classList.add('form__fieldset--active');
                } else {
                    fieldset.classList.remove('form__fieldset--active');
                }
            }
        );
        if (id !== 'prev') {
            findBtn(id).disabled = true;
        }
        setButtonsDisabled();
    };

    const changeSlide = (e) => {
        setTimeout(() => {
            document.body.classList.add('form--active');
        }, 50);

        const id = e.currentTarget.dataset.id;

        if (id === 'next' && currentStep < fieldsets.length - 1) {
            currentStep += 1;
        } else if (id === 'prev' && currentStep > 0) {
            currentStep -= 1;
        }

        updateVisibility(id);
    };

    buttons.forEach((button) => {
            button.addEventListener('click', changeSlide);
        }
    );

    const createFormTime = (date, day) => {
        const {day: days} = date.find(item => item.month === month)
        const daysData = days[day].map(item => ({
            value: `${item}:00`,
            title: `${item}:00`
        }));
        createInputRadio(formTime, 'time', daysData)
    };

    const createFormDay = (date) => {
        const {day} = date.find(item => item.month === month)
        const days = Object.keys(day);
        const typeData = days.map(item => ({
            value: item,
            title: item
        }));
        createInputRadio(formDay, 'day', typeData);
    };

    const createFormMonth = (months) => {
        formMonths.textContent = '';
        const buttonsMonths = months.map((item)=> {
            const btn = document.createElement('button');
            btn.className = 'form__btn-month';
            btn.type = 'button';
            btn.textContent = item[0].toUpperCase() + item.substring(1).toLowerCase();
            
            if (item === month) {
                btn.classList.add('form__btn-month--active');
            }
            return btn;
        });

        formMonths.append(...buttonsMonths);
        buttonsMonths.forEach((btn)=> {
            btn.addEventListener('click', ({target}) => {
                if (target.classList.contains('form__btn-month--active')) {
                    return;
                } 
                buttonsMonths.forEach((btn)=> {
                    btn.classList.remove('form__btn-month--active');
                });
                target.classList.add('form__btn-month--active');
                month = target.textContent.toLowerCase();
                const {date} = data.find(item => item.type === dataToWrite.dataType.type);
                createFormDay(date);
                setButtonsDisabled();
                formTime.parentElement.classList.remove('checked');
            });
        });
    };

    const dataToWrite = {
        dataType: {},
        day: {},
        time: {},
    }

    const createFormType = () => {
        const typeData = data.map(item => ({
            value: item.type,
            title: item.title
        }));
        createInputRadio(formType, 'type', typeData);
    }

    const createInputRadio = (wrapper, name, data) => {
        wrapper.textContent = '';
        data.forEach((item)=> {
            const div = document.createElement('div');
            div.classList = 'radio';
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = name;
            input.id = item.value;
            input.value = item.value;
            input.classList = 'radio__input';
            const label = document.createElement('label');
            label.htmlFor = item.value;
            label.textContent = item.title;
            label.classList = 'radio__label';
            div.append(input, label);
            wrapper.append(div);
        });
    };

    const allMonths = [
        'январь',
        'февраль',
        'март',
        'апрель',
        'май',
        'июнь',
        'июль',
        'август',
        'сентябрь',
        'отктябрь',
        'ноябрь',
        'декабрь'
    ];

    const showResultData = () => {
        const currentYear = new Date().getFullYear();
        const monthsIndex = allMonths.findIndex(item => item === month);
        const dateString = `${currentYear}-${(monthsIndex + 1).toString().padStart(2, '0')}-${
            dataToWrite.day.toString().padStart(2, '0')}T${dataToWrite.time}`;
        formInfoType.textContent = dataToWrite.dataType.title;
        const dateObject = new Date(dateString);
        const formattedDate = dateObject.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit'
        });
        formInfoData.innerHTML = `
            <span class="form__info-data-day">${formattedDate}</span>
            <span class="form__info-data-time">${dataToWrite.time}</span>
        `;                   
        formInfoData.datetime = dateString;

    };
    const validateInputs = (inputList) => inputList.some(input => {
        let isText = input.type !== 'radio' && 
        input.type !== 'checkbox' && 
        input.required && 
        !input.value;
        let isChecked = input.checked; 
        return isText || isChecked;
    });

    const validateForm = () => {
       let isValid = true;
       const containerElements = fieldsets[currentStep]
       .querySelectorAll('.form__radio-wrapper, .form__input-wrapper');
        //joining 2 arrays
        let inputList = [];
        containerElements.forEach(container => {
            inputList.push(Array.from(container.querySelectorAll('input')));
        });

        let isValidChecked;

        for(let item of inputList) {
            isValidChecked = validateInputs(item);
            if(!isValidChecked) {
                isValid = false;
            }
            if (isValidChecked && currentStep === 1) {
                formTime.parentElement.classList.add('checked');
            }
        };
        return isValid;
    };

    const onInput = ({currentTarget, target}) => {
        if (currentStep === 0) {
            findBtn('prev').classList.remove('form__btn-active');
            if (currentTarget.type.value) {
                let target = currentTarget.type.value;
                const typeObject = data.find(e=> e.type === target);
        
                if (typeObject) {
                    dataToWrite.dataType.type = typeObject.type;
                    dataToWrite.dataType.title = typeObject.title;
                    const {date} = typeObject;
                    const months = date.map(el => el.month);
                    createFormMonth(months); 
                    createFormDay(date);    
                }
            }
        }  
        if (currentStep === 1) {
            if (currentTarget.day && target.name === 'day') {
                dataToWrite.day = currentTarget.day.value;
                const dateTime = data.find(e=> e.type === dataToWrite.dataType.type).date;
                createFormTime(dateTime, dataToWrite.day);
            }
            if (currentTarget.time.value && currentTarget.day.value && target.name === 'time') {
                dataToWrite.time = currentTarget.time.value;
            }
        }
        setButtonsDisabled();    
    };

    form.addEventListener('input', onInput);
    form.addEventListener('submit', async(e)=> {
        e.preventDefault();
        const formData = new FormData(form);
        const formDataObject = Object.fromEntries(formData);
        formDataObject.month = month;

        try {
            const response = await fetch('https://forest-quark-seeder.glitch.me/api/orders', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(formDataObject)
            });
            if (response.ok) {
                alert('Данные успешно отправлены!');
                form.reset();
            } else {
                const response = await fetch('https://forest-quark-seeder.glitch.me/api');
                if (!response.ok) {
                    throw new Error(`Error, status: ${response.status}`);
                }
                return await response.json();
            }

        } catch (error) {
            console.log(`Ошибка  при отправке данных: ${error}`)
        }
    });

    createFormType();
}

init()


const form = document.querySelector('.form');
const fieldsets = document.querySelectorAll('.form__fieldset');
const buttons = document.querySelectorAll('.form__btn');
const inputs = document.querySelectorAll('.form__input, .radio__input');

let currentStep = 0;

const findBtn = (id) => {
    for (let button of buttons) {
        if (button.getAttribute('data-id') === id) {
            return button;
        }
    }
    return null;
};

const updateVisibility = (id) => {

    document.body.classList.remove('form--active')

    fieldsets.forEach((fieldset, index) => {
            if (currentStep === index) {
                fieldset.classList.add('form__fieldset--active');
            } else {
                fieldset.classList.remove('form__fieldset--active');
            }
        }
    )

    if (id !== 'prev') {
        findBtn(id).disabled = true;
    }

    const isValidChecked = validateForm('radio');

    findBtn('next').disabled = !isValidChecked;

    const isValidText = validateForm('text');

    findBtn('submit').disabled = isValidText;

    findBtn('next').classList.add('form__btn-active');
    findBtn('prev').classList.add('form__btn-active');

    if (currentStep === fieldsets.length - 1) {
        findBtn('submit').classList.add('form__btn-active');
        findBtn('next').classList.remove('form__btn-active');
    } else {
        findBtn('submit').classList.remove('form__btn-active');
    }

    if (currentStep === 0) {
        findBtn('prev').classList.remove('form__btn-active');
    }

}

const changeSlide = (e) => {
    setTimeout(() => {
        document.body.classList.add('form--active');
    }, 250)

    e.preventDefault();
    const id = e.currentTarget.dataset.id;

    if (id === 'next' && currentStep < fieldsets.length - 1) {
        currentStep += 1;
    } else if (id === 'prev' && currentStep > 0) {
        currentStep -= 1;
    }

    updateVisibility(id);

}

buttons.forEach((button) => {
        button.addEventListener('click', changeSlide);
    }
)

const validateForm = (type) => {
    let isValid = true;

        const containerElements = fieldsets[currentStep]
        .querySelectorAll('.form__radio-wrapper, .form__input-wrapper');

        containerElements.forEach((container) => {
            
            const inputList = container.querySelectorAll('input');

            let hasValueCheck = false;
            let hasValueInput = false;

            inputList.forEach((input) => {
                if ((type === 'checkbox' || type === 'radio') && input.checked) {
                    hasValueCheck = true;
                } else if (type === 'text' && !input.value && input.required) {
                    hasValueInput = true;
                }
            });
            if (!hasValueCheck) {
                isValid = false;
            }
            if (hasValueInput) {
                isValid = true;
            }
        });

        return isValid;
    }


const onInput = () => {
    const isValidChecked = validateForm('radio');
    const isValidText = validateForm('text');
    findBtn('next').disabled = !isValidChecked;
    findBtn('submit').disabled = isValidText;
}

inputs.forEach((input) => {
        input.addEventListener('input', onInput);
    }
)
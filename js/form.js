const form = document.querySelector('.form');
const fieldsets = document.querySelectorAll('.form__fieldset');
const buttons = document.querySelectorAll('.form__btn');
const inputs = document.querySelectorAll('.form__input, .radio__input');

let currentStep = 0;

const findBtn = (button) => document.querySelector(`[data-id="${button}"]`);

const updateVisibility = (id) => {
    fieldsets.forEach((fieldset, index) => {
        if (currentStep === index) {
            fieldset.classList.add('form__fieldset--active');
        } else {
            fieldset.classList.remove('form__fieldset--active');
        }
        document.body.classList.remove('form--active')
    }

    )
    if (id !== 'prev') {
        findBtn(id).disabled = true;
    }

    validateForm();

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

const validateForm = () => {

    for (let i = 0; i < fieldsets.length; i++) {

        if (currentStep === i) {

            let fields = fieldsets[i].querySelectorAll('.form__radio-wrapper, .form__input-wrapper');

            const length = fields.length - 1;
            let hasMissingInput = false;

            fields.forEach((field, i) => {
                const inputList = field.querySelectorAll('input');
                let hasMoreInput = false;

                for (let j = 0; j < inputList.length; j++) {
                    if (inputList[j].type === 'text' && !inputList[j].value.trim()) {
                        hasMissingInput = true;
                    }

                    if (inputList[j].checked) {
                        hasMoreInput = true;
                    }
                }

                if (!hasMoreInput) {
                    findBtn('next').disabled = true;
                }

                if (hasMoreInput) {
                    for (let k = i + length; k < fields.length; k++) {
                        const otherInputs = fields[k].querySelectorAll('input');
                        let otherHasMoreInput = false;

                        for (let l = 0; l < otherInputs.length; l++) {
                            if (otherInputs[l].checked) {
                                otherHasMoreInput = true;
                            }
                        }
                        if (otherHasMoreInput) {
                            findBtn('next').disabled = false;
                        }
                    }
                }
            });

            if (hasMissingInput) {
                findBtn('submit').disabled = true;
            } else {
                findBtn('submit').disabled = false;
            }
        }
    }
}


inputs.forEach((input) => {
        input.addEventListener('input', validateForm);
    }
)
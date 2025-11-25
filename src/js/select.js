import a from "css-magi"
class Select {
    constructor(element) {
        this.options = {
            classNameDropdownPopup: 'select-dropdown-popup',
            classNameDropdownOption: 'select-dropdown-option',
            classNameDropdownOpen: 'select-dropdown-open',
            ...JSON.parse(element.dataset.options || '{}'),
        };
        const $dropdownInput = this.createDropdownInput(element);
        element.after($dropdownInput);


        this.createDropdownPopup({
            $dropdownInput,
            element,
        });
    }

    getBoundingClientRect(element) {
        return {
            width: element.getBoundingClientRect().width,
            height: element.getBoundingClientRect().height,
            bottom: element.getBoundingClientRect().bottom,
            left: element.getBoundingClientRect().left,
            widthCss: element.getBoundingClientRect().width + 'px',
            heightCss: element.getBoundingClientRect().height + 'px',
            bottomCss: element.getBoundingClientRect().bottom + 'px',
            leftCss: element.getBoundingClientRect().left + 'px',
        };
    }

    setStyle($element, styles) {
        Object.keys(styles).forEach(key => {
            $element.style[key] = styles[key];
        });
    }

    createDropdownInput(element) {
        const { widthCss, heightCss } = this.getBoundingClientRect(element);
        const $input = document.createElement('div');
        $input.classList.add('select-dropdown-input', ...Array.from(element.classList));

        this.setStyle($input, {
            width: widthCss,
            height: heightCss,
            marginTop: `-${heightCss}`,
            opacity: '0',
            boxSizing: 'border-box',
        });

        return $input;
    }

    createDropdownPopup({ $dropdownInput, element }) {
        const { classNameDropdownPopup, classNameDropdownOption, classNameDropdownOpen } = this.options;
        const $dropdownPopup = document.createElement('div');
        $dropdownPopup.classList.add(classNameDropdownPopup);
        $dropdownInput.textContent = element.options[0].text;

        const updatePositionDropdown = (show) => {
            const { bottomCss, leftCss, widthCss } = this.getBoundingClientRect(element);
            this.setStyle($dropdownPopup, {
                display: 'block',
                top: bottomCss,
                left: leftCss,
                width: widthCss,
                position: 'fixed',
                boxSizing: 'border-box',
                display: 'none',
            });

            if (typeof show === 'boolean') {
                [element, $dropdownInput, $dropdownPopup].forEach(({ classList }) => {
                    classList.toggle(classNameDropdownOpen, show);
                });
                $dropdownPopup.style.display = show ? 'block' : 'none';
            }
        }

        const onSelectOption = ({ option }) => {
            // Update selected option
            option.selected = true;
            // Update text
            $dropdownInput.textContent = option.text;
            $dropdownInput.dataset.value = option.value;

            element.dispatchEvent(new Event('change'));
            // Update selected option in the dropdown popup
            $dropdownPopup.querySelectorAll(`.${classNameDropdownOption}`).forEach(dropdownOption => {
                dropdownOption.dataset.selected = dropdownOption.DOMElement.selected;
            });
        }

        Array.from(element.options).forEach(option => {
            const { value, text } = option;
            const $option = document.createElement('div');

            $option.classList.add(classNameDropdownOption);
            $option.textContent = text;
            $option.dataset.value = value;
            $option.dataset.binding = 'option';
            $option.dataset.text = text;

            // Register event listeners for the option
            $option.DOMElement = option;
            $option.addEventListener('click', () => {
                $dropdownInput.textContent = text;
                $dropdownInput.dataset.value = value;
                updatePositionDropdown(false);
                onSelectOption({
                    option: option,
                });
            });

            $dropdownPopup.appendChild($option);
        });

        const registerEventListeners = () => {
            $dropdownInput.addEventListener('click', () => {
                updatePositionDropdown(!element.classList.contains(classNameDropdownOpen));
            });
            // click outside of the dropdown list
            document.addEventListener("click", (event) => {
                if (!$dropdownPopup.contains(event.target) && !$dropdownInput.contains(event.target)) {
                    updatePositionDropdown(false);
                }
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    updatePositionDropdown(false);
                }
            });

            document.addEventListener('scroll', () => {
                updatePositionDropdown();
            });

            document.addEventListener('resize', () => {
                updatePositionDropdown();
            });
        }

        registerEventListeners();
        document.body.appendChild($dropdownPopup);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.select-dropdown').forEach(select => {
        new Select(select);
    });
});

new EventSource('/esbuild').addEventListener('change', () => {
    location.reload();
});

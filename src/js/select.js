class Select {
    constructor(element) {
        const $dropdownInput = this.createDropdownInput(element);
        element.after($dropdownInput);

        this.createdropdownPopup({
            $dropdownInput: $dropdownInput,
            element: element,
        });
    }

    createDropdownInput(element) {
        const $input = document.createElement('div');
        $input.classList = element.classList;
        $input.classList.add('select-dropdown-input');

        element.style.display = 'none';

        return $input;
    }

    createdropdownPopup({ $dropdownInput, element }) {
        const $dropdownPopup = document.createElement('div');
        $dropdownPopup.classList.add('select-dropdown-popup');
        $dropdownInput.textContent = element.options[0].text;

        const updatePositionDropdown = (show) => {
            $dropdownPopup.style.display = 'block';
            $dropdownPopup.style.top = `${$dropdownInput.getBoundingClientRect().bottom}px`;
            $dropdownPopup.style.left = `${$dropdownInput.getBoundingClientRect().left}px`;
            $dropdownPopup.style.width = `${$dropdownInput.getBoundingClientRect().width}px`;

            if (typeof show === 'boolean') {
                $dropdownPopup.style.display = show ? 'block' : 'none';
            }
        }

        const onSelectOption = ({ option, $option }) => {
            // Update text
            $dropdownInput.textContent = option.text;
            $dropdownInput.dataset.value = option.value;
            // Update selected option
            option.selected = true;
            element.dispatchEvent(new Event('change'));
            // Update selected option in the dropdown popup
            $dropdownPopup.querySelectorAll('.select-dropdown-option').forEach(option => {
                option.dataset.selected = option.realOption.selected;
            });
        }

        Array.from(element.options).forEach(option => {
            const { value, text } = option;
            const $option = document.createElement('div');
            $option.classList.add('select-dropdown-option');
            $option.textContent = text;
            $dropdownPopup.appendChild($option);

            // Register event listeners for the option
            $option.realOption = option;
            $option.addEventListener('click', () => {
                $dropdownInput.textContent = text;
                $dropdownInput.dataset.value = value;
                updatePositionDropdown(false);
                onSelectOption({
                    option: option,
                    $option: $option,
                });
            });
        });


        const registerEventListeners = () => {
            $dropdownInput.addEventListener('click', updatePositionDropdown);
            // click outside of the dropdown list
            document.addEventListener("click", (event) => {
                if (!$dropdownPopup.contains(event.target) && !$dropdownInput.contains(event.target)) {
                    updatePositionDropdown(false);
                }
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

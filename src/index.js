/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const CLASS_NAME_WIDGET_TOGGLE = 'wa-widget-toggle'
const CLASS_NAME_WIDGET_CONTENT = 'wa-widget-content'
const CLASS_NAME_WIDGET_EXPANDED = 'expanded'
const CLASS_NAME_WIDGET_FORM_REQUIRED = 'required'

const SELECTOR_VALUE_TOGGLE_CHAT = 'wa-chat'
const SELECTOR_VALUE_TOGGLE_SEND = 'wa-send'

const SELECTOR_CHAT_WIDGET = '[data-chat]'
const SELECTOR_DATA_TOGGLE_CHAT = `[data-toggle="${SELECTOR_VALUE_TOGGLE_CHAT}"]`
const SELECTOR_DATA_TOGGLE_SEND = `[data-toggle="${SELECTOR_VALUE_TOGGLE_SEND}"]`
const SELECTOR_DATA_MESSAGE = `[data-message]`

const DefaultConfig = {
    name: '',
    division: '',
    photo: '',
    introduction: '',
    nameInput: true,
    emailInput: false,
    subjectInput: false,
    messageInput: true
}

const DefaultType = {
    name: 'string',
    division: 'string',
    photo: 'string',
    introduction: 'string',
    nameInput: 'boolean',
    emailInput: 'boolean',
    subjectInput: 'boolean',
    messageInput: 'boolean'
}

const ChatData = {}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
export default class Chat {
    constructor(element, config) {
        if (ChatData[element.id])
            return

        this._element = element       
        this._config = this._getConfig(config)
        this._phoneNumber = this._element.getAttribute('action')
        this._isShown = false
        this._toggleChat = ''
        this._contentElement = ''
        this._toggleSend = ''
        this._buildHTML()
        this._cacheElements()

        ChatData[element.id] = this
    }

    // PUBLIC
    toggle() {
        this._isShown ? this._hide() : this._show()
    }

    // PRIVATE
    _sendMessage() {
        const send_url = 'https://web.whatsapp.com/send'

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
            send_url = 'whatsapp://send'

        const inputs = this._element.querySelectorAll(SELECTOR_DATA_MESSAGE)
        let parameters = send_url + '?phone=' + this._phoneNumber + '&text='
        let valid = true
        inputs.forEach((item) => {
            if (!this._formValidation(item))
                return valid = false

            const title = item.getAttribute('data-message')
            parameters += title.replace(/^./, title[0].toUpperCase()) + ': ' + item.value + ';\n'
        })

        if (valid) window.open(parameters, '_blank')
    }

    _buildHTML() {
        if (this._element.innerHTML) return false

        const HTML_ELEMENT_INPUT_NAME = this._config.nameInput ? '<input data-message="name" type="text" placeholder="Name" required>' : ''
        const HTML_ELEMENT_INPUT_EMAIL = this._config.emailInput ? '<input data-message="email" type="email" placeholder="Email" required>' : ''
        const HTML_ELEMENT_INPUT_SUBJECT = this._config.subjectInput ? '<input data-message="subject" type="text" placeholder="Subject" required>' : ''
        const HTML_ELEMENT_INPUT_MESSAGE = this._config.messageInput ? '<input data-message="message" type="text" placeholder="Message" required>' : ''

        const HTML_ELEMENT_WIDGET_MAIN = 
            `<a class="${CLASS_NAME_WIDGET_TOGGLE}" data-toggle="${SELECTOR_VALUE_TOGGLE_CHAT}" data-target="#${this._element.id}" href="#${this._element.id}">
                <svg viewBox="0 0 90 90" fill="rgb(79, 206, 93)" width="32" height="32">
                    <path
                        d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522   c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982   c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537   c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938   c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537   c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333   c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882   c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977   c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344   c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223   C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z">
                    </path>
                </svg>
            </a>
            <div class="${CLASS_NAME_WIDGET_CONTENT} chat-tab">
                <header class="chat-header">
                    <div class="chat-admin-picture">
                        <img src="${this._config.photo}" alt="${this._config.name}'s Photos">
                    </div>
                    <div class="chat-admin-details">
                        <h4>${this._config.name}</h4>
                        <p><small>${this._config.division}</small></p>
                    </div>
                </header>
                <div class="chat-content">
                    <div class="chat-item">
                        <p>${this._config.introduction}</p>
                    </div>
                </div>
                <div class="chat-form">
                    ${HTML_ELEMENT_INPUT_NAME}
                    ${HTML_ELEMENT_INPUT_EMAIL}
                    ${HTML_ELEMENT_INPUT_SUBJECT}
                    ${HTML_ELEMENT_INPUT_MESSAGE}
                    <button class="chat-send" type="submit" data-toggle="${SELECTOR_VALUE_TOGGLE_SEND}"><strong>Send</strong></button>
                </div>
            </div>`
        
        this._element.insertAdjacentHTML('afterbegin', HTML_ELEMENT_WIDGET_MAIN)
        return true
    }

    _cacheElements() {
        this._toggleChat = document.querySelector(`${SELECTOR_DATA_TOGGLE_CHAT}[data-target="#${this._element.id}"]`)
        this._contentElement = this._element.getElementsByClassName(CLASS_NAME_WIDGET_CONTENT).item(0)
        this._toggleSend = this._element.querySelector(SELECTOR_DATA_TOGGLE_SEND)
        if (this._toggleChat) {
            this._toggleChat.addEventListener("click", (e) => {
                e.preventDefault()
                this.toggle()
            })
        }
        if (this._toggleSend) {
            this._toggleSend.addEventListener('click', (e) => {
                e.preventDefault()
                this._sendMessage()
            })
        }
    }

    _show() {
        this._element.classList.add(CLASS_NAME_WIDGET_EXPANDED)
        this._toggleChat.classList.add(CLASS_NAME_WIDGET_EXPANDED)
        this._contentElement.classList.add(CLASS_NAME_WIDGET_EXPANDED)
        this._isShown = true

        Object.keys(ChatData).forEach(key => {
            if (key !== this._element.id && ChatData[key]._isShown)
                ChatData[key].toggle()
        })
    }

    _hide() {
        this._element.classList.remove(CLASS_NAME_WIDGET_EXPANDED)
        this._toggleChat.classList.remove(CLASS_NAME_WIDGET_EXPANDED)
        this._contentElement.classList.remove(CLASS_NAME_WIDGET_EXPANDED)
        this._isShown = false
    }

    _formValidation(formElement) {
        if (!formElement.required) return true

        formElement.classList.remove(CLASS_NAME_WIDGET_FORM_REQUIRED)

        switch (formElement.type) {
            case 'email':
                if (!/^\S+@\S+$/.test(formElement.value)) {
                    formElement.classList.add(CLASS_NAME_WIDGET_FORM_REQUIRED)
                    return false
                }
                break;
            default:
                if (formElement.value == '' || formElement.value == null) {
                    formElement.classList.add(CLASS_NAME_WIDGET_FORM_REQUIRED)
                    return false
                }
                break;
        }
        return true
    }

    _getConfig(config) {
        config = {
            ...DefaultConfig,
            ...config
        }
        this._typeCheckConfig('Widget', config, DefaultType)
        return config
    }

    _typeCheckConfig(componentName, config, configTypes) {
        Object.keys(configTypes).forEach(property => {
            const expectedTypes = configTypes[property]
            const value = config[property]
            const valueType = value && this._isElement(value) ?
                'element' :
                this._toType(value)

            if (!new RegExp(expectedTypes).test(valueType)) {
                throw new Error(
                    `${componentName.toUpperCase()}: ` +
                    `Option "${property}" provided type "${valueType}" ` +
                    `but expected type "${expectedTypes}".`)
            }
        })
    }

    _isElement(obj) {
        (obj[0] || obj).nodeType
    }

    // AngusCroll (https://goo.gl/pxwQGp)
    _toType(obj) {
        if (obj === null || obj === undefined) {
            return `${obj}`
        }

        return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase()
    }
}

document.body.onload = () => {
    const chatSelector = document.querySelectorAll(SELECTOR_CHAT_WIDGET)
    for (let i = 0; i < chatSelector.length; i++) {
        const element = chatSelector[i]
        const data = new Chat(element, {})
    }
}

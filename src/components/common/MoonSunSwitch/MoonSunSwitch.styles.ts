import {BORDER_RADIUS} from '@app/styles/themes/constants'
import {Button} from 'components/common/buttons/Button/Button'
import styled, {css} from 'styled-components'

interface BtnProps {
    theme: string
}

export const Btn = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;

    &.ant-btn-icon-only.ant-btn-sm {
        height: 1.875rem;
    }
`

export const ButtonGroup = styled.div<BtnProps>`
    display: inline-flex;
    padding: 0.325rem;
    column-gap: 0.325rem;

    border-radius: ${BORDER_RADIUS};

    background-color: rgba(var(--primary-rgb-color), 0.1);

    ${props => {
        switch (props.theme) {
            case 'dark':
                return css`
                    & > ${Btn}:nth-of-type(1) {
                        background: var(--primary-color);
                        color: var(--text-secondary-color);
                    }
                `
            case 'star':
                return css`
                    & > ${Btn}:nth-of-type(2) {
                        background: var(--warning-color);
                        color: var(--text-secondary-color);
                    }
                `

            case 'light':
                return css`
                    & > ${Btn}:nth-of-type(3) {
                        background: var(--warning-color);
                        color: var(--text-secondary-color);
                    }
                `

            default:
                return ''
        }
    }}

    &:not(:last-of-type) {
        margin-bottom: 0.625rem;
    }
`

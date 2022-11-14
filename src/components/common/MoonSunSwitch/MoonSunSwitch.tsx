import React from 'react'
import * as S from './MoonSunSwitch.styles'
import {MoonIcon} from '@app/components/common/icons/MoonIcon'
import {SunIcon} from '@app/components/common/icons/SunIcon'
import {StarIcon} from '@app/components/common/icons/StarIcon'

interface MoonSunSwitchProps {
    themeActive: string
    onClickMoon: () => void
    onClickSun: () => void
    onClickStar: () => void
}

export const MoonSunSwitch: React.FC<MoonSunSwitchProps> = ({themeActive, onClickMoon, onClickSun, onClickStar}) => {
    return (
        <S.ButtonGroup theme={themeActive}>
            <S.Btn size="small" type="link" icon={<MoonIcon />} onClick={onClickMoon} />
            <S.Btn size="small" type="link" icon={<StarIcon />} onClick={onClickStar} />
            <S.Btn size="small" type="link" icon={<SunIcon />} onClick={onClickSun} />
        </S.ButtonGroup>
    )
}

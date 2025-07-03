import './Button.css';

export function Button({ id, text, active, onClick }: { id: string, text: string, active?: boolean, onClick?: () => void }) {
    return (
        <button id={id} className={active ? 'active' : ''} onClick={onClick} >{text}</button>
    )
}

export default Button;
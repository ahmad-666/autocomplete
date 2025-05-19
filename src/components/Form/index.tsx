import { type ComponentProps, type FormEvent } from 'react';

type Props = ComponentProps<'form'> & {};

export default function Form({ noValidate = true, autoComplete = 'on', onSubmit, children, ...rest }: Props) {
    const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit?.(e);
    };

    return (
        <form noValidate={noValidate} autoComplete={autoComplete} onSubmit={onSubmitHandler} {...rest}>
            {children}
        </form>
    );
}

//? Usage:
{
    /* <Form onSubmit={e=>{...}}>
   <Textfield  />
   <button type='submit'>submit</button>
</Form> */
}

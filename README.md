# Zustand-based form validator

- Beta version of library is ready



**// todo**
- Docs and nice examples will be ready little bit later
- Tests coming soon!
- Licence (Will MIT)



Sample:
```typescript jsx
// Custom validators
const codeValidator = (v) => /^\d{6}$/.test(v) || 'Enter correct code'

// Define form
export const useMyNiceForm = createFormValidator<{
    name: string
    code: string
}>({
    name: {
        required: true,
    },
    code: {
        required: true,
        rules: [codeValidator],
    },
})

const AnyComponent = () => {
    const {
        values,
        errors,
        onChange,
        onBlur,
        isValid,
        bind,
        reset
    } = useSupportRequestForm();
    
    
    return <>
        <Input
            label='Name'
            
            value={values.name}
            
            errorMessage={errors.name}
            
            // Or via bind
            onBlur={bind.name.onBlur}
            // Or own
            onBlur={() => onBlur('name')}

            // Or via bind
            onChange={bind.name.onChange}
            // Or own
            onChange={(name) => onChange({ name })}
            
            // Or just pass props
            {...bind.name}
        />
        
        {/* Simple use when onChange emmits value (not ChangeEvent)*/}
        <Input
            label='Code'
            value={values.code}
            errorMessage={errors.code}
            {...bind.code}
        />
        
        <Button type='submit' disabled={!isValid} value='Send'/>
    </>
}
```

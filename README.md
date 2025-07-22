# Zustand-based form validator
For any reasons You can write me letter to me@davidhaker.ru

# ✨ **Features**

### 🌐 **Locale Support**

- `locale: Locale` → Current form language (default: browser locale)
- `setLocale(locale: Locale)` → Change form language dynamically

### ✅ **Validation & State**

- `isValid(): boolean` → Checks if the entire form is valid
- `errors: FormErrorsType<T>` → Maps fields to their **first error** (e.g., `errors.yourField`)
- `valid: FormValidFlagsType<T>` → Per-field validity flags (e.g., `valid.yourField`)
- `validate(silent?: boolean, include?: Array<keyof T>)` → Triggers validation (silent validation (without putting error to `errors`) for fields with new values, or not silent - with putting errors)

### 🔄 **Form Control**

- `reset()` → Resets form to `initialValues`
- `setValues(values: Partial<T>)` → Updates form values and silent validation (without putting error to `errors`) for fields with new values
- `setInitialValues(values: Partial<T>)` → Updates **initial** values (for dirty-checking)

### 📌 **Form Binding**

- `bind: FormBindType<T>` → Methods to bind inputs to form
  - `bind.yourField.value` - Value getter (alias of `values.yourField`)
  - `bind.yourField.onBlur` - Callback to bind blur event of field `yourField`, also you can do it via `onBlur('yourField')`
  - `bind.yourField.onChange(to: string)` - Callback to send change of field `yourField` to form storage, also you can do it via `onChange({yourField: toValue})`
- `onChange(fieldValue: Partial<T>)` → Handles value changes (e.g.: `onChange={(to) => onChange({ yourField: to })}`)
- `onBlur(field: keyof T)` → Handles blur events (useful for validation, e.g.: `onBlur={() => onBlur('yourField')}`)

### 🔍 **State Tracking**

- `values: T` → Current form values map (e.g., `values.yourField`)

- `initialValues: T` → Original/default/initial values (e.g., `initialValues.yourField`)

- `hasModified(): boolean` → Checks if `values` ≠ `initialValues` (dirty state)

  

# Step by step sample

### 0. Imagine form

That contains 4 fields: name, email and password twice. Two password fields should be equal.

### 1. Define validators

```ts
const nameValidator = (v) => v && v.length > 3 || 'Name should have 3 or more letters'

const passwordsShouldBeEqualsValidator = (v, {values}) => v === values.password2 || 'Password should be equal'
```

### 2. Define form

```tsx
import { createFormValidator } from 'zustand-forms';
import { emailValidator } from 'zustand-forms/validators'

const useMyForm = createFormValidator<{
    name: string
    email: string
    passowrd1: string
    password2: string
}>({
    name: {
        required: true
    },
    email: {
    	required: true,
        rules: [emailValidator],
	},
    password1: {
        required: true,
    },
    password2: {
        required: true,
        rules: [passwordsShouldBeEqualsValidator],
    },
})
```

### 3. Use form validator

```tsx
export const MyFormComponent: FC = () => {
    const {
        bind,
        isValid,
        errors,
    } = useMyForm();
    
    return <form>
        {errors.name && <label>{errors.name}</label>}
    	<input placeholder="Name" {...bind.name}/>
        
        {errors.email && <label>{errors.email}</label>}
    	<input placeholder="Email" {...bind.email}/>
        
        {errors.password1 && <label>{errors.password1}</label>}
    	<input placeholder="Password" {...bind.password1}/>
        
        {errors.password2 && <label>{errors.password2}</label>}
    	<input placeholder="Repeat password" {...bind.password2}/>
        
        <input type="submit" disabled={!isValid()}/>
    </form>
}
```





# More samples:

# **📌** Complex sample:

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
        initialValue: '000000',
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
        reset,
        hasModified,
        setInitialValues,
        setValues,
    } = useSupportRequestForm();
    
    // Change initial values (e.g. loaded from back)
    setInitialValues({
        name: 'Default name',
        code: ''
    })
    
    // Mass set values (e.g. loaded from backend)
    setValues({
        name: 'Name from backend',
        code: '123456'
    })
    
    
    const areSubmitDisabled = !isValid() || !hasModified()

    return <>
        <Input
            label='Name'
            
            // Via values
            value={values.name}
            
            // Via bindings
            value={bind.name.value}
            
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
            errorMessage={errors.code}
            {...bind.code}
        />
        
        <Button type='submit' disabled={areSubmitDisabled} value='Send'/>
    </>
}
```



# **📌** Validation across multiple fields:

```tsx
const passwordsShouldBeEqualsValidator = (v, {values}) => v === values.password2 || 'Password should be equal'

export const useMyNiceForm = createFormValidator<{
    password1: string
    password2: string
}>({
    password1: {
        required: true,
    },
    password2: {
        required: true,
        rules: [passwordsShouldBeEqualsValidator],
    },
})
```



# 📋 TO DO

- [ ] Add predefined validators
  - [ ] Validate string length
  - [ ] Validate number - is greater or is lower
  - [ ] Validate date - in range, greater, lower
  - [ ] Password strength validation1

- [ ] Tests coming soon!
- [ ] Make docs more obviously
- [ ] Nice obviously examples and use cases
- [ ] Performance tests
- [ ] Validation modes (on change, on blur, or combined)
- [ ] I18n for custom validators (for cases, when app are multilingual)
- [ ] Customizable binding interface (For passing `{...bind.yourField}` to element props to completely bind it to the form) - reason: different UI KIT's have different props names, in one place - `onChange`, in other just `change` prop of `<Input/>` component.


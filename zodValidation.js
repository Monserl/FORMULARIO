const { z } = window.Zod;

// Esquema de validación con Zod
const registerSchema = z.object({
  name: z.string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { 
      message: "El nombre solo puede contener letras y espacios" 
    }),
  
  email: z.string()
    .email({ message: "Ingresa un correo electrónico válido" }),
    
  password: z.string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .regex(/[A-Z]/, { 
      message: "La contraseña debe contener al menos una mayúscula" 
    })
    .regex(/[0-9]/, { 
      message: "La contraseña debe contener al menos un número" 
    })
});

// Manejador de eventos para el formulario
document.getElementById("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  
  const formData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value
  };

  // Validar los datos con Zod
  const result = registerSchema.safeParse(formData);

  if (!result.success) {
    showErrors(result.error);
  } else {
    // Si la validación es exitosa
    alert("¡Registro exitoso!\n\nDatos válidos:\n" + 
          `Nombre: ${result.data.name}\n` +
          `Email: ${result.data.email}`);
    // Aquí podrías enviar los datos al servidor
    // registerForm.submit();
  }
});

// Mostrar errores en la interfaz
function showErrors(error) {
  error.errors.forEach((err) => {
    const field = err.path[0];
    const errorElement = document.getElementById(`${field}-error`);
    const inputElement = document.getElementById(field);
    
    if (errorElement && inputElement) {
      errorElement.textContent = err.message;
      inputElement.classList.add('input-error');
    }
  });
}

// Limpiar errores anteriores
function clearErrors() {
  const errorMessages = document.querySelectorAll('.error-message');
  const inputs = document.querySelectorAll('input');
  
  errorMessages.forEach(el => el.textContent = '');
  inputs.forEach(input => input.classList.remove('input-error'));
}

// Validación en tiempo real (opcional)
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => {
    const field = input.id;
    const value = input.value.trim();
    
    if (value) {
      const result = registerSchema.safeParse({
        [field]: value
      });
      
      const errorElement = document.getElementById(`${field}-error`);
      if (!result.success) {
        const error = result.error.errors.find(e => e.path[0] === field);
        if (error) {
          errorElement.textContent = error.message;
          input.classList.add('input-error');
        }
      } else {
        errorElement.textContent = '';
        input.classList.remove('input-error');
      }
    } else {
      document.getElementById(`${field}-error`).textContent = '';
      input.classList.remove('input-error');
    }
  });
});
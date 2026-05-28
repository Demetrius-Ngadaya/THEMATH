// utils/sweetalert.js
import Swal from 'sweetalert2'

export const showSuccess = (title, message) => {
    return Swal.fire({
        icon: 'success',
        title: title,
        text: message,
        confirmButtonColor: '#3085d6',
        timer: 3000,
        showConfirmButton: true
    })
}

export const showError = (title, message) => {
    return Swal.fire({
        icon: 'error',
        title: title,
        text: message,
        confirmButtonColor: '#d33'
    })
}

export const showWarning = (title, message) => {
    return Swal.fire({
        icon: 'warning',
        title: title,
        text: message,
        confirmButtonColor: '#3085d6'
    })
}

export const showConfirm = (title, message, confirmText = 'Yes', cancelText = 'Cancel') => {
    return Swal.fire({
        title: title,
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmText,
        cancelButtonText: cancelText
    })
}
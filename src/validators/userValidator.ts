import * as z from "zod/v4";


export const UserValidator = z.object({
  name : z.string().min(1,"Ім'я обов'язкове").max(50, "Завелике ім'я"),
  phone : z.string().min(10, "Номер має бути або формату +380XXXXXXXXX або 0XXXXXXXXX").max(13, "Номер має бути або формату +380XXXXXXXXX або 0XXXXXXXXX"),
  password : z.string().min(6, "Пароль не менше 8 символів").max(50, "Завеликий пароль")
}) 
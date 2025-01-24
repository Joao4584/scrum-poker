// import {
//   Injectable,
//   NestMiddleware,
//   BadRequestException,
// } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class CaptchaValidationMiddleware implements NestMiddleware {
//   async use(req: any, res: any, next: () => void) {
//     const captchaToken = req.body.captchaToken;

//     if (!captchaToken) {
//       throw new BadRequestException('Captcha token is required');
//     }

//     try {
//       // Substitua pela sua chave secreta do Google reCAPTCHA
//       const secretKey = process.env.RECAPTCHA_SECRET_KEY;

//       // Envia a requisição para validar o CAPTCHA
//       const response = await axios.post(
//         `https://www.google.com/recaptcha/api/siteverify`,
//         null,
//         {
//           params: {
//             secret: secretKey,
//             response: captchaToken,
//           },
//         },
//       );

//       // Se o CAPTCHA não for válido, lançar um erro
//       if (!response.data.success) {
//         throw new BadRequestException('Captcha validation failed');
//       }

//       // Se a validação passar, continuar com a requisição
//       next();
//     } catch (error) {
//       throw new BadRequestException('Captcha validation failed');
//     }
//   }
// }

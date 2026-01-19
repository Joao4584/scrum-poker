import { Controller, Get, Header } from '@nestjs/common';

@Controller('docs')
export class SwaggerController {
  @Get('login.js')
  @Header('Content-Type', 'application/javascript; charset=utf-8')
  getLoginScript() {
    return `
(() => {
  const injectButton = () => {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return false;

    if (document.getElementById('swagger-login-btn')) return true;

    const button = document.createElement('button');
    button.id = 'swagger-login-btn';
    button.textContent = 'Login';
    button.style.marginLeft = '12px';
    button.style.padding = '6px 12px';
    button.style.borderRadius = '6px';
    button.style.border = '1px solid #334155';
    button.style.background = '#0f172a';
    button.style.color = '#e2e8f0';
    button.style.cursor = 'pointer';

    button.onclick = async () => {
      const raw = window.prompt(
        'Cole o JSON do login (user/integration). Exemplo:\\n' +
          '{ "type":"google","email":"user@email.com","name":"Nome","avatar_url":"https://..." }'
      );
      if (!raw) return;

      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        alert('JSON inválido');
        return;
      }

      try {
        const response = await fetch('/user/integration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          credentials: 'include',
        });

        if (!response.ok) {
          const text = await response.text();
          alert('Login falhou: ' + text);
          return;
        }

        alert('Login OK. Cookie de sessão aplicado.');
      } catch (error) {
        alert('Erro ao fazer login: ' + error.message);
      }
    };

    topbar.appendChild(button);
    return true;
  };

  const tryInject = () => {
    if (injectButton()) return;
    setTimeout(tryInject, 500);
  };

  tryInject();
})();
`;
  }
}

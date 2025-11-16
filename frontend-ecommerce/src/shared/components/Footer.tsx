import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Olive Beauty</h3>
            <p className="text-sm text-muted-foreground">
              Sua loja de produtos de beleza e cuidados pessoais. 
              Encontre os melhores produtos com qualidade garantida.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
                  Carrinho
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
                  Favoritos
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Minha Conta</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                  Meus Pedidos
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Entrar
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">
                  Registrar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: contato@olivebeauty.com</li>
              <li>Telefone: (11) 9999-9999</li>
              <li>Horário: Seg-Sex, 9h às 18h</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Olive Beauty. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}


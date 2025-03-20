import { Outlet, Link } from 'react-router'

function FrontendLayout() {
  return (
    <div>
      <header>
        <nav className='mt-5'>
          <Link className='h4 mt-5 mx-2' to='/'>
            回到首頁
          </Link>
          <Link className='h4 mt-5 mx-2' to='/admin/product'>
            產品頁面
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className='mt-5 text-center'>
        <p>© 2024 Galactic Whispers by HSU XIN YU</p>
      </footer>
    </div>
  )
}

export default FrontendLayout

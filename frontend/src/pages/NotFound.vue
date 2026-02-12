<template>
  <div class="not-found-container">
    <div class="content">
      <h1>404</h1>
      <h2>¡Ups! Página no encontrada</h2>
      <p>Parece que te has perdido en el campus virtual.</p>
      <router-link to="/" class="btn-home">
        <i class="fa-solid fa-house"></i> Volver al Dashboard
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
  color: #333;
}
h1 { font-size: 6rem; color: #8480f1; margin: 0; }
h2 { font-size: 2rem; margin-bottom: 10px; }
p { color: #666; margin-bottom: 30px; }
.btn-home {
  background: #8480f1;
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s;
}
.btn-home:hover { background: #6c63ff; }
</style>
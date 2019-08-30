<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" href="#">TC Parcel</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
   
    <form class="form-inline  mr-auto mt-2 mt-lg-0">
      <input class="form-control mr-sm-2" type="search" placeholder="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
     <ul class="navbar-nav my-2 my-lg-0">
      <!-- <li class="nav-item active">
      <button type="button" class="btn btn-primary esri-icon-basemap"></button>
      </li>
      <li class="nav-item">
        <button type="button" class="btn btn-primary esri-icon-layers"></button>
      </li> -->
      <li class="nav-item">
        <button type="button" class="btn btn-primary esri-icon-settings"></button>
      </li>

    </ul>
  </div>
</nav>
   
  </header>
</template>

<script>
export default {
  name: 'Header',

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
header{
    background: gray;
    height: 55px;
    padding: 0;

}

.btn-primary {
  border-radius: 30px;
      margin: 0px 5px;
}

</style>

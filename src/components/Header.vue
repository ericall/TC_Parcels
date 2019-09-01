<template>
  <header>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <a class="navbar-brand" href="#">TC Parcel</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <form class="form-inline mx-auto">
          <input
            id="search-input"
            class="form-control mr-sm-2"
            type="search"
            placeholder="Search by address or PIN"
          />
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
        <ul class="navbar-nav my-2 my-md-0">
          <!-- <li class="nav-item active">
      <button type="button" class="btn btn-primary esri-icon-basemap"></button>
      </li>
      <li class="nav-item">
        <button type="button" class="btn btn-primary esri-icon-layers"></button>
          </li>-->
          <li class="nav-item">
            <button id="info-btn" type="button" class="btn btn-primary">
              <img id="info-img" src="../assets/info.png" />
              </button>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header"
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
header {
  background: gray;
  height: 55px;
  padding: 0;
}

.btn-primary {
  width: 45px;
  border-radius: 30px;
  margin: 0px 5px;
  background-color: #089fc1;
  transition: all 0.2s ease-in-out;
  max-height: 40px;
}

.btn-primary:hover {
  width: 135px;
  background-color: #089fc1;
  border-color: #089fc1;
}

#info-btn {
      position: absolute;
    top: 10px;
    right: 15px;
    content: "";
    height: 40px;
}

#info-btn:hover::after {
  content: " Information";
  float: right;
   // position: absolute;
    left: 7px;
}

#info-img {
   left: 10px;
    position: absolute;
    top: 7px;
}

#info-img:hover {
    float: left;
}

#search-input {
  width: 300px !important;
}
</style>

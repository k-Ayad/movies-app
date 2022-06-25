
// DOM
let dataBox = $('#dataBox');
let movieTitle = $('#movieTitle');
let openNav = $('.open-side');
let navBtn = $('.btn-holder');
let openIcon = $('#open-icon');
let navContent = $('.side-nave-content');

let linksHolder = $('.side-nave-content ul li');   // nav links
let links = $('.side-nave-content ul li a');

let searchApi =$('#searchApi');
let search = $('#search');
let searchResults = $('#results');

let userInputs = $('.user-inputs input');


let searchArea ; // data that returned from api

// nav animations 

let navFlag = false;
navBtn.click(function(){
    if(navFlag == false)
    {
        openNav.animate({left: '250px'} , 500);
        navContent.animate({left: '0px'} , 500 , function(){
          linksHolder.css('paddingTop' , '25px');
        });
        openIcon.addClass('fa-times');
        navFlag= true ;
    }else
    {
        openNav.animate({left: '0px'} , 500);
        navContent.animate({left: '-250px'} , 500);
        openIcon.removeClass('fa-times');
        linksHolder.css('paddingTop' , '500px');
        navFlag= false ;
    }
    
  }); 

  

// fetching data from api 

// my personal key is 84a42fd6bcec010af98d933fb04769ab

async function getData(file) {
    let myObject = await fetch(file);
    let data = await myObject.json();
    searchArea = data.results;
    displayData(data.results , false);  
    searchResults.empty();
  }

  // FUNCTION TO DISPLAY MOVIES IN HTML
  function displayData(dataArr , isSearch)
  {
    let box =``;
    let movieName ="";
    let relDate="";
    for(let i =0 ; i< dataArr.length ; i++)
    {
        //fix undefined problem for some movie names
        movieName = dataArr[i].original_title ;
        if(movieName == undefined)
        {
            movieName = dataArr[i].name;
        }

        //fix undefined problem for some movie release date 
        relDate = dataArr[i].release_date;
        if(relDate == undefined)
        {
            relDate = dataArr[i].first_air_date;
        }
        box += `<div class=" col-lg-4 col-md-6 ">
        <div class="position-relative poster mb-4">
            <img src="https://image.tmdb.org/t/p/original/${dataArr[i].poster_path}"  alt="">
            <div class="layer d-flex flex-wrap justify-content-center align-items-center">
                <div>
                    <h2>
                        ${movieName}
                    </h2>

                    <p>
                        ${dataArr[i].overview}
                    </p>

                    <p>
                        rate: ${dataArr[i].vote_average}
                    </p>

                    <p>
                        ${relDate}
                    </p>
                </div>
                
            </div>
        </div>
        
    </div>`;
                
    }


    if(isSearch == true)
    {
      searchResults.html(box);
    }else
    {
      dataBox.html(box); 
    }
    
  }


  links[0].addEventListener('click' , function(){
    displayNowPlaying();
  });

  links[1].addEventListener('click' , function(){
    displayPopular();
  });

  links[2].addEventListener('click' , function(){
    displayTopRated();
  });

  links[3].addEventListener('click' , function(){
    displayTrending();
  });

  links[4].addEventListener('click' , function(){
    displayUpComing();
  });




  /*-------------------- functions to choose which to display  ----------------------*/
  function displayTrending(){
    getData(`https://api.themoviedb.org/3/trending/all/day?api_key=84a42fd6bcec010af98d933fb04769ab`);
  }

  function displayNowPlaying()
  {
    getData(`https://api.themoviedb.org/3/movie/now_playing?api_key=84a42fd6bcec010af98d933fb04769ab`);
  }

  function displayPopular()
  {
    getData(`https://api.themoviedb.org/3/movie/popular?api_key=84a42fd6bcec010af98d933fb04769ab`)
  }

  function displayTopRated()
  {
    getData(`https://api.themoviedb.org/3/movie/top_rated?api_key=84a42fd6bcec010af98d933fb04769ab`)
  }

  function displayUpComing()
  {
    getData(`https://api.themoviedb.org/3/movie/upcoming?api_key=84a42fd6bcec010af98d933fb04769ab`);
  }


  displayNowPlaying();


  //------------------- search code ----------------- 
  
  // search on api 
  searchApi.on('input' , function(){
    getData(`https://api.themoviedb.org/3/search/movie?api_key=84a42fd6bcec010af98d933fb04769ab&query=${this.value}`);
  });

  // search on the page 
  search.on('input' , function(){
    let searchResults = [];
    for(let i=0; i< searchArea.length ; i++)
    {
      if(searchArea[i].original_title.toLowerCase().includes(this.value.toLowerCase()) )
        {
          searchResults.push(searchArea[i]);
        }
    }

    displayData(searchResults, true);
  });




// ------------- Valedation ---------------------


// user Name
userInputs[0].addEventListener('input' , function(){
    let regax = /[a-zA-Z]/;
    displayAlert(regax , this);
});

// user email
userInputs[1].addEventListener('input' , function(){
  // name should start with letter then it could have . or _ aftar that it should have letters also then @ then letters then . then at least 2 letter (.eg)
  let regax = /^[a-z]+[_.]?[a-z]+@[a-z]+\.[a-z]{2,}$/; 
  displayAlert(regax , this);
});

userInputs[2].addEventListener('input' , function(){
  // it could have +2 or not .. then starts with 01 then 9 numbers 
  let regax = /^(\+2)?(01)[0-9]{9}$/;
  displayAlert(regax,this);
});


userInputs[3].addEventListener('input' , function(){
  // any number .. do not start with 0   
  let regax = /^[^0][0-9]*$/;
  displayAlert(regax , this);
});

userInputs[4].addEventListener('input' , function(){
    // positive lookahead to search for a character and a number within the input << (?=) >> it could start with it or not << .* >> 
    // numbers or characters or special characters can be matched
    let regax = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_@$!%*#?&]{8,}$/
    displayAlert(regax,this);
});

userInputs[5].addEventListener('input' , function(){
  if(userInputs[4].value != this.value)
  {
    this.nextElementSibling.classList.remove('d-non');
    
  }else
  {
    this.nextElementSibling.classList.add('d-non');
  }
});


function displayAlert (regax , that) // valedation alert 
{
  if(regax.test(that.value) != true)
    {
      that.nextElementSibling.classList.remove('d-non');
    }else
    {
      that.nextElementSibling.classList.add('d-non');
    }
}

//----------------
//  openNav.animate({height:window.innerHeight},500


$(window).resize(function() {
  openNav.height = openNav.height ;
});





 
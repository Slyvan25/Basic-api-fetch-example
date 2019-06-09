const table = document.getElementById("table");
const loadingscreen = document.getElementById("loading-img");
const api_url = "http://localhost:5001/api";
var beers;

//#region shows loading screen until page is fully loaded
let tid = setInterval( function () {
    if ( document.readyState !== 'complete' ) return;
    clearInterval( tid );  
    // do your work
    loadingscreen.style.display = "none";
    table.style.display = "block";
}, 100 );
//#endregion

//#region GET - beer info
fetch(`${api_url}/bier`)
    .then((Response)=>
    {
        return Response.json();
    })
    .then((api)=>
    {
        console.log(api);
        beers = api;

        api.forEach(beer =>
        {
            table.innerHTML += `<tr onclick="CreateModal(${beer.id})" >
                <th>${beer.id}</th>
                <th>${beer.brouwer}</th>
                <th>${beer.gisting}</th>
                <th>${beer.naam}</th>
                <th>${Math.round(beer.perc * 100).toFixed(2)}%</th>
                <th>${beer.type}</th>
                <th>${beer.inkoopPrijs}</th>
            </tr>`
        });
    })
//#endregion

//#region modal -- change
function CreateModal(id)
{

    //checks if there is a modal still in the dom
    if(!document.getElementsByTagName("modal")[0])
    {
        fetch(`${api_url}/bier/${id}`)
            .then((Response)=>
            {
                return Response.json();
            })
            .then((item)=>
            {
                document.getElementsByTagName("section")[0].innerHTML += `
                <modal class="animated BounceIn">
                    <nav>
                        <span>${item.naam}</span>
                        <a onclick="RemoveModal();">&#x292B;</a>
                    </nav>
                    <div>
                        <form>
                            <fieldset>
                                <legend>Verander informatie voor het biertje ${item.naam}:</legend>
                                Brouwer:<br>
                                <input type="text" name="Brewer" value="${item.brouwer}">
                                <br><br>
                                Naam:<br>
                                <input type="text" name="name" value="${item.naam}">
                                <br><br>
                                Gisting:<br>
                                <input type="text" name="Fermentation" value="${item.gisting}">
                                <br><br>
                                Percentage:<br>
                                <input type="text" name="percentage" value="${item.perc}">
                                <br><br>
                                Type:<br>
                                <input type="text" name="type" value="${item.type}">
                                <br><br>
                                Inkoop prijs:<br>
                                <input type="text" name="price" value="${item.inkoopPrijs}">
                                <br><br>
                                <input type="button" value="Verander" onclick="SubmitForm(${item.id});"> <input type="button" value="Verwijder" onclick="removeItem(${item.id});"> 
                            </fieldset>
                    </form>
                    </div>
                </modal>`
            });
    }
}
//#endregion

//#region modal -- add
    function addItemModal()
    {
        if(!document.getElementsByTagName("modal")[0])
            {
                document.getElementsByTagName("section")[0].innerHTML += `
                <modal class="animated BounceIn">
                    <nav>
                        <span>Biertje toevoegen</span>
                        <a onclick="RemoveModal();">&#x292B;</a>
                    </nav>
                    <div>
                        <form>
                            <fieldset>
                                <legend>Voeg een biertje toe die nog niet in de lijst staat:</legend>
                                Brouwer:<br>
                                <input type="text" name="Brewer">
                                <br><br>
                                Naam:<br>
                                <input type="text" name="name">
                                <br><br>
                                Gisting:<br>
                                <input type="text" name="Fermentation">
                                <br><br>
                                Percentage:<br>
                                <input type="text" name="percentage">
                                <br><br>
                                Type:<br>
                                <input type="text" name="type">
                                <br><br>
                                Inkoop prijs:<br>
                                <input type="text" name="price">
                                <br><br>
                                <input type="button" value="Verander" onclick="addItem();">
                            </fieldset>
                    </form>
                    </div>
                </modal>`;
            }
    }
//#endregion

//#region modal remove
function RemoveModal()
{
    document.getElementsByTagName("modal")[0].remove();
}
//#endregion

//#region submit form
function SubmitForm(id, _method)
{
    var beer = new Object();
    
        beer.Id = id;
        beer.Naam = document.getElementsByName("name")[0].value;
        beer.Brouwer = document.getElementsByName("Brewer")[0].value;
        beer.Type = document.getElementsByName("type")[0].value;
        beer.Gisting = document.getElementsByName("Fermentation")[0].value;
        beer.Perc= document.getElementsByName("percentage")[0].value;
        beer.inkoopPrijs = document.getElementsByName("price")[0].value;
    

    try
    {
        fetch(`${api_url}/bier/${id}`,
        {
            method : 'PUT',            
            body: JSON.stringify(beer),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then((Response)=>
        {
            return Response.json();
        })
        .then(beer =>
        {
            console.log(JSON.stringify(beer));
        });
    }
    catch (error)
    {
        console.log(error);
    }
}
//#endregion

//#region remove item
    function removeItem(id)
    {
        fetch(`${api_url}/bier/${id}`,
        {
            method: 'DELETE'
        })
        .then((api)=>
        {
            console.log(api);
        })
    }
//#endregion

//#region add item
function addItem()
{
    let beerObject = {
        Naam : document.getElementsByName("name")[0].value,
        Brouwer : document.getElementsByName("Brewer")[0].value,
        Type : document.getElementsByName("type")[0].value,
        Gisting : document.getElementsByName("Fermentation")[0].value,
        Perc : document.getElementsByName("percentage")[0].value,
        inkoopPrijs : document.getElementsByName("price")[0].value
    }

    fetch(`${api_url}/bier/`, 
    {
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(beerObject)
    })
    .then(api =>
        {
            console.log(api);
        });
}

//#endregion
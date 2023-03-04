// Global Imports
import { useState, useContext } from "react";
import Category from "../../types/category";

// Local imports
// Context
import { menuContext } from "../menu";

function CreateItem(){
    // Get from .env file the number of icons
    let icon_plates:number = Number(process.env.REACT_APP_PLATES_ICONS);
    // Take the base link from the .env file
    let base_link:string | undefined = process.env.REACT_APP_BASE_LINK;
    let token: any = localStorage.getItem("token");

    const {categories, update, setUpdate, setDonePopupVisible,
        setDonePopupText, auth} = useContext(menuContext);
    console.log(auth.image_menu)

    const [itemName, setItemName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [itemPrice, setItemPrice] = useState(0);
    const [selectedIcon, setSelectedIcon] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(-1);
    const [checked, setChecked] = useState(false);

    // Error handling
    const activateError = () => {
        let flag = true;
        if(itemName === ""){
            let problem = document.getElementById("categoryProblem5");
            problem!.style.display = "block";
            flag = false;
        }
        if(itemDescription === ""){
            let problem = document.getElementById("categoryProblem6");
            problem!.style.display = "block";
            flag = false;
        }
        if(itemPrice <= 0){
            let problem = document.getElementById("categoryProblem7");
            problem!.style.display = "block";
            flag = false;
        }
        return flag;
    }

    const deactivateError = () => {
        let problem = document.getElementById("categoryProblem5");
        problem!.style.display = "none";

        let problem2 = document.getElementById("categoryProblem6");
        problem2!.style.display = "none";

        let problem3 = document.getElementById("categoryProblem7");
        problem3!.style.display = "none";
    }

    const createItem = (e: any) => {
        e.preventDefault();
        let flag = activateError();

        if(flag){
            // Call the API to create the item
            let currentUrl = window.location.href;
            let id = currentUrl.split("/")[4];

            if (id === undefined || isNaN(parseInt(id))) {
                window.location.href = "/login";
            }

            let data = {
                "category": selectedCategory,
                "name": itemName,
                "description": itemDescription,
                "price": itemPrice,
                "iconId": selectedIcon,
                "isActive": true,
                "number": 1,
                "facts": {}
            }

            if(selectedCategory===-1){
                data["category"] = categories[0].id;
                setSelectedCategory(categories[0].id);
            }

            fetch(`${base_link}/item/create/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    "HTTP_TOKEN": token
                },
                body: JSON.stringify(data)
                }).then(function(response) {
                if(response.status === 403){
                    window.location.href = "/login";
                }
                // Update the menu
                setUpdate(!update);
                setItemPrice(0);
                setItemName("");
                setItemDescription("");
                setDonePopupVisible(true);
                setDonePopupText("Prodotto creato con successo!");
                return response.json();
              });
        }
        
    }

    const changeCategoryIcon = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, icon:number) => {
        e.stopPropagation();
        setSelectedIcon(icon);
        // Call the API to update the category
    }

    return (
        <div className="createBox">
            <p>Create Item</p>
            <form className="generalForm" onSubmit={(e) => createItem(e)}>
                <label htmlFor="categoryName">Nome del Prodotto</label>
                <p id="categoryProblem5">Il nome e' obbligatorio</p>
                <input  type="text" value={itemName} onChange={(e) => {setItemName(e.target.value);deactivateError()}} />

                <label htmlFor="categoryDescription">Descrizione del Prodotto</label>
                <p id="categoryProblem6">La descrizione e' obbligatoria</p>
                <input type="text" value={itemDescription} onChange={(e) => {setItemDescription(e.target.value)
                deactivateError()}} />

                <label htmlFor="categoryDescription">Prezzo del Prodotto</label>
                <p id="categoryProblem7">Il prezzo deve essere maggiore di 0.00$</p>
                <input type="number" required min="0" step=".01" value={itemPrice} onChange={(e) => {setItemPrice(Number(e.target.value))
                deactivateError()}} />

                <label>Categoria</label>
                <select name="category" className="selectionCategory" value={selectedCategory}
                    onChange={(e) => {setSelectedCategory(Number(e.target.value));console.log(selectedCategory)}}>
                    {categories.map((category: Category) => {
                        return (
                            <option key={category.id} value={Number(category.id)}>{category.name}</option>
                        )
                    })}
                </select>
                
                <label> {checked ? "Icone" : "Immagini"} </label>
                    <label className="switch" style={{display: auth.image_menu ? "block" :"none"}}>
                        <input type="checkbox" onChange={() => setChecked(!checked) } />
                        <span className="slider round"></span>
                    </label>
                    <p>Premi per inserire le immagini o le icone</p>
                
                <section className="iconsChoice" style={{display: checked ? "none" : "grid"}}>
                    
                    {Array.from(Array(icon_plates).keys()).map((icon) => {
                        return (
                            <img key={icon} src={`/plates/food_${icon+1}.svg`} alt="Category cover"
                            onClick={(e) => {changeCategoryIcon(e, icon);}} className="foodIcon"
                            style={{backgroundColor: icon === selectedIcon ? "#530F26" : "white" }} />
                        )
                    })
                    }
                </section>

                <section className="iconsChoice" style={{display: checked ? "grid" : "none"}}>
                    
                </section>

                <button type="submit">Crea</button>
            </form>
        </div>
    )
}

export default CreateItem;
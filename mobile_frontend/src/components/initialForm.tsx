// Global imports
import { useState, useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';

// Local imports
// Components
import Header from './header';
import Footer from './footer';

import Restaurant from '../types/restaurant';
import restaurants from '../fake_data.json'

function InitialForm(){
    // setting up basic variables given by the environment
    let min_order_plan:number = Number(process.env.REACT_APP_MIN_ORDER_PLAN);

    // Get the id from the url
    const { id } = useParams<{id: string}>();
    const identificationNumber:number = Number(id);

    // State and history
    const [tableNumber, setTableNumber] = useState<number>(1);
    const [bringsNumber, setBringsNumber] = useState<number>(1);
    let history = useNavigate();

    // API restaurant of faker in production
    const allRestaurants:Restaurant[] = restaurants["restaurants"];
    const restaurant: Restaurant = allRestaurants.filter((restaurant:Restaurant) => restaurant.id === identificationNumber)[0];

    useEffect(() => {
        // when loaded up, if the restaurant has a plan < 2, the bringsNumber is set to 1
        // and he is sent to the menu page, as the restaurant has only the main plan
        // and only lets see the menu
        if(restaurant.plan < min_order_plan){
            history(`/mytable/menu/${id}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const goToOrderPage = (e:any) => {
        e.preventDefault();
        history(`/mytable/menu/${id}?talbe=${tableNumber}&brings=${bringsNumber}`);
    }

    return (
        <>
            <Header name={restaurant.name} />
            <form className="initialForm" onSubmit={(e)=>goToOrderPage(e)}>
                <label className='labelsN'>Inserire il numero del tavolo:</label>
                <input className='enterN' type={'number'} placeholder={'Enter table number'} value={tableNumber} onChange={(e)=> setTableNumber(Number(e.target.value)) } />         
                
                <div style={{display: restaurant.plan >= min_order_plan ? 'fixed' : 'none'}} className="brings">
                    <label className='labelsN'>Inserire il numero delle portate:</label>
                    <input className='enterN' type={'number'} placeholder={'Brings number'} value={bringsNumber} onChange={(e)=> setBringsNumber(Number(e.target.value)) } />
                    <p>(se si intende consumare in un unica portata, si selezioni 1)</p>
                </div>

                <button type={'submit'} className='submission'>Vai al menu'</button>

            </form>
            <Footer />
        </>
    )
}

export default InitialForm;
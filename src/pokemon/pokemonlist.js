import React,{useState, useContext} from 'react'
import {PokemonContext} from './pokemonContext'
import { Card, Button, Modal, Tag, Layout, Menu, Input, Form, notification, Spin } from 'antd'
import {CaretRightOutlined, CaretLeftOutlined} from '@ant-design/icons'
import axios from 'axios'

const Meta = Card
const {Header} = Layout

const PokemonList = () => {
   const [modal, setModal] = useState(false);
   const [pokemonImg, setPokemonImg] = useState('')
   const [pokemonName, setPokemonName] = useState('')
   const [type, setType] = useState('');
   const [exp, setExp] = useState('');
   const [pageActive, setPageActive] = useState(1)
   const [getPokemon, setGetPokemon] = useState(false)
   const [pokemonNick, setPokemonNick] = useState('')
   const [loaderAdd, setLoaderAdd] = useState(false)
   const [loaderDelete, setLoaderDelete] = useState(false);

   const { pokemonList, loaded, nextAction, prevAction, page, yourPoke, yourPokemon } = useContext(PokemonContext)
   console.log(yourPoke.nickname, 'LIST POKEMONss');

   const handleOk = () => {
      setModal(false);
    };
  
    const handleCancel = () => {
      setModal(false);
      setGetPokemon(false);
      setPokemonNick('')
    };
   
   const detailPokemon = (data) => {
      setModal(true)
      console.log(data, 'DATA CLICK');
      setPokemonImg(data.sprites.front_default);
      setPokemonName(data.name)
      setType(data.types)
      setExp(data.base_experience)
   }

   const actionPage = (data) => {
      setPageActive(data)
   }

   const getPokemonStatus = () => {
      let a = Math.floor(Math.random()* 2)
      if(a === 0){
         notification["warning"]({
            message: 'Failed to get pokemon !!',
          });
         handleCancel();
      } else{
         setGetPokemon(true)
      }  
   }

   const onChangeInput = (e) => {
      setPokemonNick(e.target.value)
     
   }
   
   const addYourPokemon = () => {
      const cekNickname = []
      yourPoke.forEach(element => {
         cekNickname.push(element.nickname)
      })
      console.log(cekNickname, 'CEKK');
      console.log(pokemonNick, 'NICK');
      
      
      if(cekNickname.includes(pokemonNick)){
         console.log("haloo");
         notification["warning"]({
            message: 'Nickname already exist !!',
          });
      }
      else{
         setLoaderAdd(true)
         axios.post("https://5e8ecf49fe7f2a00165ee9ff.mockapi.io/todo", {name : pokemonName, image : pokemonImg, nickname : pokemonNick})
         .then((res) => {
            setLoaderAdd(false)
            notification["success"]({
               message: 'Pokemon add to your list !!',
             });
            console.log(res, 'ress');
            handleCancel()
            yourPokemon()
         }).catch((err) => {
            console.log(err, 'error');
         })
      }        
   }

   const deletePokemon = (id) => {
      console.log(id, 'ID');
      setLoaderDelete(true)
      axios.delete(`https://5e8ecf49fe7f2a00165ee9ff.mockapi.io/todo/${id}`)
      .then((res) => {
         setLoaderDelete(false)
         notification["success"]({
            message: 'Pokemon deleted !!',
          }); 
         yourPokemon()
      }).catch((err) => {
         console.log(err, 'error');
      })
   }

   console.log(loaderAdd, 'DADS');
   
   return(
      <div classname = "Pokemon-Content" style={{width : '100%'}}>

     <div className = "header-pokemon">
      <Header>
         <div className="logo" />
         <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style ={{display:'flex', justifyContent:'center'}}>
         <Menu.Item key="1" onClick ={() => actionPage(1)}>Pokemon List</Menu.Item>
         <Menu.Item key="2" onClick ={() => actionPage(2)}>My Pokemon List</Menu.Item>
         </Menu>
         </Header>
     </div>
      

      {pageActive === 1 && 
       <div className = "pokemon-list">
       <div className = "pagination">
          <Button type="primary" shape="round" size={'small'} icon = {<CaretLeftOutlined />} onClick = {prevAction}  />
          <p>{page}</p>
          <Button type="primary" shape="round" size={'small'} icon = {<CaretRightOutlined />} onClick = {nextAction}  />
       </div>
       
       <div className = "Card-List">
          {pokemonList.map((data, index) =>
              
             <div className = "Poke-Card">
                <Card
                   hoverable
                   style={{ width: 240}}
                   onClick = {() => detailPokemon(data)}
                   cover={<img alt="example" src={data.sprites.front_default}/>} >
                <p className = "name">{data.name.toUpperCase()}</p>
                </Card>
             </div>
          )}
       </div>

       <div className = "pagination">
          <Button type="primary" shape="round" size={'small'} icon = {<CaretLeftOutlined />} onClick = {prevAction}  />
          <p>{page}</p>
          <Button type="primary" shape="round" size={'small'} icon = {<CaretRightOutlined />} onClick = {nextAction}  />
       </div>
       </div>}

       {pageActive === 2 && 
         <Spin spinning = {loaderDelete}>
      <div className = "Card-List">
       
         {yourPoke.map((data, index) =>
            <div className = "Poke-Card">
               <Card
                  title = {data.nickname.toUpperCase()}
                  hoverable
                  style={{ width: 240}}
                  cover={<img alt="example" src={data.image}/>} >
               <p className = "name">{data.name.toUpperCase()}</p>
               <Button key = {data.id} className = "button-footer" onClick = {() => deletePokemon(data.id)}> Delete Pokemon</Button>
               </Card>
            </div>
         )}
      </div>
      </Spin> }
     

         <Modal title="Basic Modal" visible={modal} onOk={handleOk} onCancel={handleCancel} width = {250}  style = {{backgroundColor : '#252525 !important'}}>
            <div className = "card-modal">
            <p className = "name-modal">{pokemonName.toUpperCase()}</p>
                  <Card
                     hoverable
                     style={{ width: 200}}
                     cover={<img alt="example" src={pokemonImg}/>} >
                     <div className = "information-skill">
                        {type!== '' && type.map((data, index)  => 
                        
                           <Tag color="success" key={index}>{data.type.name.toUpperCase()}</Tag>
                        )}   
                     </div>
                     <div className = "information-poke">
                        <p>Base Experience : {exp}</p>
                     </div>
                  </Card>  
                  <Button className = 'button-footer' onClick = {()=> getPokemonStatus()}>Catch</Button>  
                  {getPokemon === true &&
                  <div>
                     <Form  name="basic"
                     initialValues={{ remember: true }}>
                     <Form.Item
                           name="username"
                           rules={[{ required: true, message: 'Please input your nickname!' }]}
                        >
                        <Input placeholder = "Pokemon's nickname" onChange = {(e)=> onChangeInput (e)}></Input>  
                        </Form.Item>
                        <Form.Item>
                        <Button className = 'button-footer' htmlType = 'submit' onClick ={()=> addYourPokemon()} loading ={loaderAdd}>Save to list</Button>    
                        </Form.Item> 
                     </Form>
                  </div>
                   }
                      
            </div>
         </Modal>
     
      </div>

      
   );
}


export default PokemonList 
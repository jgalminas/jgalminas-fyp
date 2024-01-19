import Page from "../layouts/Page";

const Home = () => {

  const x = async() => {
    const res = await window.api.file.createHighlight("6768869264")
    console.log(res);
    
  }

  return ( 
    <Page>
      <button onClick={x}> create </button>
        Home
    </Page>
  )
}

export default Home;
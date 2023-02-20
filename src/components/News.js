import React, {useEffect,useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News=(props)=>{
  News.defaultProps={
    country: "in",
    pageSize: "21",
    category: "science",
    setProgress:"0"
  }
  News.propTypes={
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    setProgress: PropTypes.func
  }
  const [articles,setArticles]=useState([]);
  const [loading,setLoading]=useState(false);
  const [page,setPage]=useState(1);
  const [totalResults,setTotalResults]=useState(0);
  const capitalize=(string)=>{
       return string.charAt(0).toUpperCase()+string.slice(1);
  }
  const updateNews=async()=>{
    props.setProgress(10);
    let url=`http://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&&apiKey=e51f854bc3024cac8202580b86d5bb7f&page=1&pageSize=${props.pageSize}`;
    setLoading(true);
    let data=await fetch(url);
    props.setProgress(30);
    let parsedData=await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };
  useEffect(()=>{
   document.title=`${props.category==="general"?"Home":capitalize(props.category)}-NewsBuzz`;
   updateNews();
   //eslint-disable-next-line
  },[])
  
  const fetchMoreData=async ()=> {
    const url=`http://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&&apiKey=e51f854bc3024cac8202580b86d5bb7f&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1);
    setLoading(true);
    let data=await fetch(url);
    let parsedData=await data.json();
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
    setLoading(false);
  };
    return (
      <div className='container my-3'>
        <h1 className="text-center" style={{margin:"35px 0px",marginTop:"90px"}}>{`NewsBuzz-Top ${props.category==="general"?"":capitalize(props.category)} Headlines`}</h1>
        {loading&&<Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length!==totalResults}
          loader={<Spinner/> }
        >
        <div className="container">
        <div className="row">
          {articles.map((element)=>{
            return <div className="col-md-4" key={element.url} >
                    <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} 
                              imageUrl={element.urlToImage?element.urlToImage:"https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg"} 
                              newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}
                    />
                   </div>
      
          })}
        </div>
        </div>
        </InfiniteScroll> 

      </div>
    )
}

export default News

//e51f854bc3024cac8202580b86d5bb7f  old API KEY kushharsh
//5016596a8d494aa881288196cf0138e5  harshkush
import React, {createRef} from 'react';
import { connect } from 'react-redux';
import axios from 'axios'
import {Table} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from "reactjs-popup";
import {LatLng} from './map';
import config from './apiConfig.json';

export interface OwnProps {
  position: LatLng,
  radius: number,
};
  
type Props = StateProps & DispatchProps & OwnProps

// make this header based on given information
const headers = ["Item Name", "Quantity", "Distance", "Date Posted", "Contact", "Action"]
const columns = ["Name", "Quantity", "Distance", "DatePosted", "Contact"]
const dummyData = [
{ 
	"distance" : {
		"value":0.0,
		"metrics":"string"
	},
	"content" : {
		"id": "string1",
	 	"name": "string1",
	 	"quantity": 0,
	  	"daily_use": 0,
		"current_stock": 0,
	  	"notes": "string1",
	  	"supplyPointResource": {
		    "canProduce": 0,
		    "id": "string1",
		    "numRequested": 0,
		    "numinStock": 0,
		    "resources": [null],
	    	"supplypoint": {
  			"address": "string1",
			"city": "string1",
  			"hasSterilization": true,
  			"isDistributor": true,
  			"isHealthcare": true,
  			"latx": 0,
  			"longy": 0,
  			"name": "string1",
  			"notes": "string1",
  			"phonenumber": "string1",
  			"primaryContactName": "string1",
  			"priority": 0,
			"resourceLocations": [
			    null
			  ],
  			"state": "string1",
  			"zip": "string1"
	    }
	  }
	}
}
]
const actionItems = [
    {
        icon: 'trash',
        color: 'red',
        style: {cursor: 'pointer'},
    },
    {
        icon: 'pencil-alt',
        color: 'blue',
        style: {cursor: 'pointer'},
    },
    {
        icon: 'eye',
        color: 'green',
        style: {cursor: 'pointer'},
    },
]

type State = {
  viewIndex: number,
  fetchedData: any 
};

class PostComponent extends React.Component<Props, State> {
  state = {
    viewIndex: -1,
    fetchedData: dummyData, // mocking the data
  }
  componentDidMount() {
    const {position: {lat, lng}, radius} = this.props;
    axios.get(`${config.getUri}?distance=${radius}&page=0&size=1000&units=km&x=${lat}&y=${lng}`)
    .then(({data}) => {
      this.setState({
        fetchedData: data,
      });
    })
  }

  closeModel = () => {
    this.setState({
        viewIndex: -1,
    });
  }

  handleView = (index) => () => {
    // implement view feature here
    this.setState({
        viewIndex: index
    });
  }


  render() {
    const {lat, lng} = this.props.position;
    const {radius} = this.props;
    return (
      <div className="get-items-display">
        <div className="info-div">
          <p> Getting data for user: {this.props.account.login} </p>
          <p> lat, lng: {lat}, {lng} </p>
          <p> Radius: {radius} KM </p>
        </div>
        <Table>
          <thead>
            {
              headers.map(item => (
                <th key={item}>
                  {item}
                </th>
              ))
            }
          </thead>
          <tbody>
            {
              // change dummy data with required data
              this.state.fetchedData.map((item, index) => (
                <tr key={item.content.id}>
                      <td key={`${item.content.id}-Name`}>
                        {item.content.name }
                      </td>
                      <td key={`${item.content.id}-Quanity`}>
                        {item.content.quantity }
                      </td>
                      <td key={`${item.content.id}-Distance`}>
                        {item.distance.value}
                      </td>
					 <td key={`${item.content.id}-DatePosted`}>
                        TDB
                     </td>
                     <td key={`${item.content.id}-Contact`}>
                        TDB
                     </td>
                  {/* for the action column. Change the icons */}
                  <td>
                    <div className='action-items flex'>
                      {/* <FontAwesomeIcon onClick={this.handleDelete} icon='trash' color='red' style={{cursor: 'pointer'}}/>{' '} */}
                      {/* <FontAwesomeIcon onClick={this.handleEdit} icon='pencil-alt' color='blue' style={{cursor: 'pointer'}}/>{' '} */}
                      <FontAwesomeIcon onClick={this.handleView(index)} icon='eye' color='green' style={{cursor: 'pointer'}}/>{' '}
                    </div>
                    <div>
                    </div>
                    <div>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
        {/* change this accordingly */}
        {
            this.state.viewIndex !== -1 && 
            <Popup
                open={this.state.viewIndex !== -1}
                closeOnDocumentClick
                onClose={this.closeModel}
            >
                <div className="info-div">
                    <pre>
                        <code>
                            {JSON.stringify(this.state.fetchedData[this.state.viewIndex].content.supplyPointResource, undefined, 4)}
                        </code>
                    </pre>
                </div>
            </Popup>
        }
      </div>
    )
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
});
const mapDispatchToProps = { };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps)(PostComponent);

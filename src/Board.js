import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(client => !client.status || client.status === 'backlog'),
        inProgress: clients.filter(client => client.status && client.status === 'in-progress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }

  componentDidMount(){
    this.initializeDragula();
  }

  initializeDragula() {
    //set up the drake 
    this.drake = Dragula([
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ]);
    //when the item is dropped call the update function
    this.drake.on('drop', (el, target, source, sibling)=> this.updateclient(el, target, source, sibling));
  }

  unmountdragula(){
    this.drake.remove();
  }

  updateclient(el,target, _, sibling){

    //im new to react but this seems like a brute force method and not very elegant

    this.drake.cancel(true);

    //figure out which swimlane we are in
    let newSwimlane = 'backlog';
    if(target === this.swimlanes.inProgress.current){
      newSwimlane = 'in-progress';
    }else if(target === this.swimlanes.complete.current){
      newSwimlane = 'complete';
    }

    //create the new modified clients list
    const clientlist = [
      ...this.state.clients.backlog,
      ...this.state.clients.inProgress,
      ...this.state.clients.complete,
    ];
    const clientmoved = clientlist.find(client => client.id === el.dataset.id);
    //set what client has changed and what swinlane it is now in
    const clientthatmoved = {
      ...clientmoved,
      status: newSwimlane,
    }
    //if the client is the same as the one that moved remove it
    const updatedclient = clientlist.filter(client => client.id !== clientthatmoved.id);

    //find the sibling (file above it)
    const index = updatedclient.findIndex(client => sibling && client.id === sibling.dataset.id)

    //place the client next to the sibling
    updatedclient.splice(index === -1 ? updatedclient.length : index, 0, clientthatmoved)

    //update the state
    this.setState({
      clients: {
        backlog: updatedclient.filter(client => !client.status || client.status === 'backlog'),
        inProgress: updatedclient.filter(client => client.status && client.status === 'in-progress'),
        complete: updatedclient.filter(client => client.status && client.status === 'complete'),
      }
    });
  }

  

  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'backlog'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'backlog'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'backlog'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'backlog'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'backlog'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'backlog'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'backlog'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'backlog'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'backlog'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref) {
    console.log("renderSwimLane");
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref}/>
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('in-progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

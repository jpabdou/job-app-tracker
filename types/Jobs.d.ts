export interface Job {company: string, title: string, jobLink: string, jobDescription: string, location: string, dateApplied: string, applicationRoute: string, outreachContact: string, emailFollowup: string, jobNumber: number  ,appStatus: string, _id?: mongoDB.BSON.ObjectId, id?: string, user_id?: string};
export interface JobEntry {company: string, title: string, dateApplied: string, applicationRoute: string, outreachContact: string, emailFollowup: string, appStatus: string, _id?: mongoDB.BSON.ObjectId, id?: string, jobNumber: number , user_id?: string};
export interface SankeyLink {
    source: string,
    target: string,
    value: number
  }
  
export interface SankeyNode {
    name: string}

export interface SankeyPlotData {nodes: Array<SankeyNode>, links: Array<SankeyLink>}

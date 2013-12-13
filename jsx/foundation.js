/** @jsx React.DOM */
var Row = React.createClass({
    render: function() {
        var className = "row "
            + (this.props.className || "");
        return (
            <div className={className}>
                {this.props.children}
            </div>
        );
    }
});

var Column = React.createClass({
    render: function() {
        var span = this.props.span || 12;
        var className= "small-" + span + " " 
            + (this.props.className || "") 
            + " columns";
        return (
            <div className={className}>
                {this.props.children}
            </div>
        );
    }
});

var Title = React.createClass({
  render: function() {
      return (
        <div className="row">
          <div className="small-12 columns">
            <h1>{this.props.children}</h1>
          </div>
        </div>
      );
  }
});


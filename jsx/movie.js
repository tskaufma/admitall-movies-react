/** @jsx React.DOM */
var MovieDetail = React.createClass({
  render: function() {
      var className = "";
      if (this.props.icon) {
          className = "fi-" + this.props.icon;
      }
      var space = " ";
      return (
        <span>
          <i className={className}></i> 
          {space}
          {this.props.children}
        </span>
      );
  }
});

var MovieDetailRow = React.createClass({
  render: function() {
      return (
        <Row><Column>
          <MovieDetail icon={this.props.icon}>
            {this.props.children}
          </MovieDetail>
        </Column></Row>
      );
  }
});

var MovieListItem = React.createClass({
  render: function() {
      var movie = this.props.movie;
      var rating = Math.round(movie.otherRating * 10) / 10;
      var releaseYear = movie.releaseDate.substr(0,4);
      var genres = movie.genres.map(function(genre) {
          return genre.name;
      }).join(", ");
      var actors = movie.cast.slice(0,3).map(function(actor) {
          return actor.name;
      }).join(", ");
      var coverpic = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w92/" 
            + movie.posterPath;

      return (
        <li>
          <Row className="collapse display">
            <Column span="2">
               <img src={coverpic} /> 
            </Column>
            <Column span="10">
          <MovieDetailRow>{movie.name} ({releaseYear})</MovieDetailRow>
          <MovieDetailRow>{movie.tagline}</MovieDetailRow>
          <Row>
            <Column className="large-9 push-3">
              <MovieDetail icon="monitor">
                {movie.format}
              </MovieDetail>
            </Column>
            <Column className="large-3 pull-9">
              <MovieDetail icon="star">
                {rating}/10
              </MovieDetail>
            </Column>
          </Row>
          <MovieDetailRow icon="pricetag-multiple">
            {genres}
          </MovieDetailRow>
          <MovieDetailRow icon="torso">
            {actors}
          </MovieDetailRow>
            </Column>
          </Row>
        </li>
      );
  }
});

var MoviesList = React.createClass({
  render: function() {
      var movieNodes = this.props.data.map(function(movie) {
          return <MovieListItem movie={movie} />;
      });
      return (
        <Row>
          <Column className="large-10 large-centered">
            <ul className="no-bullet">
              {movieNodes}
            </ul>
          </Column>
        </Row>
      );
  }
});

var MoviesListSort = React.createClass({
    getInitialState: function() {
        return {sortBy: 'Name', reverse: false};
    },
    setSort: function(e) {
        this.setState({sortBy: e.target.dataset.value});
        Foundation.libs.dropdown.close($('#sort-by-drop'));
    },
    toggleReverse: function(e) {
        this.setState({reverse: !this.state.reverse});
    },
    sortByName: function(a, b) {
        return a.name.localeCompare(b.name);
    },
    sortByReleaseDate: function(a, b) {
        return a.releaseDate.localeCompare(b.releaseDate);
    },
    render: function() {
        var sortedMovies = this.props.data.sort(this.state.sortBy == 'Name' ? this.sortByName : this.sortByReleaseDate);
        if (this.state.reverse) {
            sortedMovies.reverse();
        }
        return (
            <div>
                <Row>
                    <Column span="6">
                        <a className="small button dropdown" data-dropdown="sort-by-drop">
                            Sort by {this.state.sortBy}
                        </a>
                        <ul id="sort-by-drop" className="f-dropdown" data-dropdown-content>
                            <li>
                                <a onClick={this.setSort} data-value="Name">Name</a>
                            </li>
                            <li>
                                <a onClick={this.setSort} data-value="Release Date">Release Date</a>
                            </li>
                        </ul>
                    </Column>
                    <Column span="6">
                        <a className="small button" onClick={this.toggleReverse}>
                            {this.state.reverse ? "Descending " : "Ascending "}
                            <i className={"fi-arrow-" + (this.state.reverse ? "down" : "up")}></i>
                        </a>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <MoviesList data={sortedMovies} />
                    </Column>
                </Row>
            </div>
        );
    }
});

var MoviesListFilter = React.createClass({
    getInitialState: function() {
        return {text: ''};
    },
    onChange: function(e) {
        this.setState({text: e.target.value});
    },
    render: function() {
        var filteredMovies = this.props.data.filter(function(item, index) {
            return this.state.text == '' 
                || item.name.toLowerCase().indexOf(this.state.text.toLowerCase()) >= 0;
        }, this);
        return (
            <div>
                <Row className="collapse">
                    <Column span="1">
                        <span className="prefix">
                            <i className="fi-magnifying-glass"></i>
                        </span>
                    </Column>
                    <Column span="11">
                        <input type="text" value={this.state.text} onChange={this.onChange} />
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <MoviesListSort data={filteredMovies} />
                    </Column>
                </Row>
            </div>
        );
    }
});

var MoviesPage = React.createClass({
  getInitialState: function() {
      $.ajax({
          url: this.props.url,
          success: function(data) {
              var movies = $.grep(data.docs, function(item, index) { 
                  return item._id !== "config";
              });
              this.setState({data: movies});
          }.bind(this)
      });
      return {data: []};
  },
  render: function() {
      return (
        <div className="row">
          <div className="small-12 columns">
            <Title>Movie List</Title>
            <MoviesListFilter data={this.state.data} />
          </div>
        </div>
      );
  }
});


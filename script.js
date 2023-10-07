
var oldHeight = 0;
var jobs = [];
$(document).ready(function () {
    $.getJSON("data.json", function (data) {
        jobs = data;
        loadAllJobs(jobs);
    });

    $("#add-button").click(function () {
        $("#add-job-popup").show();
    });

    $("#close-button").click(function () {
        if (confirm("Are you sure you want to close?")) {
            $("#add-job-popup").hide();
        }
    });

    $("#close-card").click(function () {
        $("#job-popup").hide();
    });

    $("#add-job-form").submit(function (e) {
        e.preventDefault();

        // error handling

        var reader = new FileReader();
        reader.readAsDataURL($("#logo")[0].files[0]);
        
        reader.onload = function () {
            var filePath = reader.result;
            var languageArray = $("#languages").val().split(",");
            languageArray = clean(languageArray);
            var toolArray = $("#tools").val().split(",");
            toolArray = clean(toolArray);
            var job = {
                "id": jobs.length,
                "company": $("#company").val(),
                "logo": filePath,
                "new": true,
                "featured": $("#featured").is(":checked"),
                "position": $("#position").val(),
                "role": $("#role").val(),
                "level": $("#level").val(),
                "postedAt": 'now',
                "contract": $("#contract").val(),
                "location": $("#location").val(),
                "languages": languageArray,
                "tools": toolArray
            };
            jobs.push(job);
            $("#add-job-popup").hide();
            loadAllJobs();
            filterJobs();
            $("#add-job-form")[0].reset();
        };

    });


});

function clean(array){
    array = array.map(function (item) {
        return item.trim();
    });

    array = array.filter(function (item) {
        return item !== "";
    });
    return array;

}

function loadAllJobs() {
    $(".main").empty();
    var featuredJobs = jobs.filter(function (job) {
        return job.featured;
    });

    var nonFeaturedJobs = jobs.filter(function (job) {
        return !job.featured;
    });
    jobs = featuredJobs.concat(nonFeaturedJobs);
    console.log(featuredJobs);
    renderCards(featuredJobs);
    renderCards(nonFeaturedJobs);
    checkHeight();
}
function filterJobs(filter) {
    event.stopPropagation();
    $(".main").empty();
    var newFilter;
    if (filter) {
        //check if filter already exists
        var flag = true;
        var filterElement = $("#filter-list").find("span:contains('" + filter + "')");
        if (filterElement.length <= 0) {

            newFilter = `<span class="active-filter">${filter} &nbsp;<span class="close" onclick="removeFilter('${filter}')">
                        <img src="images/icon-remove.svg" alt="remove" class="close-icon">
                        </span></span>`;
            if ($("#filter-list").find("div").length === 0) {
                $("#filter-list").addClass("filter-list-active");
            }
            $("#filter-list").append(newFilter);
        }
    }
    var filterList = $("#filter-list").find("span");
    var filterArray = [];
    var filteredJobs = jobs;
    console.log(filteredJobs);
    $.each(filterList, function (key, value) {
        if ($(value).text() !== "")
            filterArray.push($(value).text());

    });

    filterArray = clean(filterArray);

    $.each(filterArray, function (key, value) {
        filteredJobs = filteredJobs.filter(function (job) {
            return job.role === value || job.level === value || job.languages.includes(value) || job.tools.includes(value);
        });
    });
    console.log(filteredJobs);

    renderCards(filteredJobs);
    checkHeight();
}
function checkHeight() {
    var newHeight = $("#filter-list").height();
    console.log(newHeight);
    if (newHeight > oldHeight + 10) {
        oldHeight = newHeight;
        var margin = parseInt($(".main").css("margin-top").replace("px", ""));
        console.log(margin);
        margin += 50;
        console.log(margin);
        $(".main").css("margin-top", margin + "px");
    }
    else if (newHeight < oldHeight) {
        oldHeight = newHeight;
        var margin = parseInt($(".main").css("margin-top").replace("px", ""));
        margin -= 50;
        $(".main").css("margin-top", margin + "px");
    }
}

function removeFilter(filter) {
    $(".main").empty();



    var filterElement = $("#filter-list").find("span:contains('" + filter + "')");
    filterElement.remove();
    //check if filter list empty
    console.log($("#filter-list").find("span").length);
    if ($("#filter-list").find("span").length === 0) {
        $("#filter-list").removeClass("filter-list-active");
        $(".main").css("margin-top", 170 + "px");

    }
    filterJobs();

}

function deleteJob(id) {
    event.stopPropagation();
    var job = jobs.find(function (job) {
        return job.id === id;
    });
    var index = jobs.indexOf(job);
    jobs.splice(index, 1);
    loadAllJobs();

}

function viewInfo(id) {
    $("#job-popup").show();
    console.log(id);
    var job = jobs.find(function (job) {
        return job.id === parseInt(id);
    });
   
    // Populate the job details in the popup
    if (job.new) {
        $("#job-popup .new-tag").show();
    } else {
        $("#job-popup .new-tag").hide();
    }
    if (job.featured) {
        $("#job-popup .featured-tag").show();
    } else {
        $("#job-popup .featured-tag").hide();
    }
    $("#job-popup .logo").attr("src", job.logo);
    $("#job-popup .position").text(job.position);
    $("#job-popup .company").text(job.company);
    $("#job-popup .posted-expanded").text(job.postedAt);
    $("#contract-text").text(job.contract);
    $("#role-text").text(job.role);
    $("#level-text").text(job.level);
    $("#location-text").text(job.location);

    $("#languagesList").empty();
    $.each(job.languages, function (index, language) {
        $("#job-popup #languagesList").append('<div class="detail-content">' + language + '</div>');
    });

    $("#job-popup #toolsList").empty();
    $.each(job.tools, function (index, tool) {
        $("#job-popup #toolsList").append('<div class="detail-content">' + tool + '</div>');
    });




    // Show the popup
    $("#job-popup").show();
}




function renderCards(array) {
    var cards = "";

    $.each(array, function (key, value) {
        var cardClass = "card";
        if (value.featured) {
            cardClass += " card-featured";
        }
        cards += `
    <div class="${cardClass}" onclick="viewInfo(id)" id="${value.id}">
      <div class="image-area">
        <img src="${value.logo}" alt="logo" class="logo">
      </div>
      <div class="description-area">
        <div class="company-wrapper">
      <label class="company">${value.company}</label>
   
      `;


        if (value.new) {
            cards += '<span class="new-tag">New!</span>';
        }

        if (value.featured) {
            cards += '<span class="featured-tag">Featured</span>';
        }



        cards += ` </div>
    <div class="job-name">
      <label class="position">${value.position}</label>
    </div>`;
        cards += `
        <div class="details">
          <span class="posted">${value.postedAt}</span>
          <span class="dot"></span>
          <span class="contract">${value.contract}</span>
          <span class="dot"></span>
          <span class="location">${value.location}</span>
        
        </div>
      </div>
        <div class="filters">
          <div class="filter" onclick="filterJobs('${value.role}')"
          >${value.role}</div>
          <div class="filter" onclick="filterJobs('${value.level}')" 
          >${value.level}</div>
      `;

        $.each(value.languages, function (index, language) {
            cards += '<span class="filter" onclick="filterJobs(\'' + language + '\')">' + language + '</span>';
        });

        $.each(value.tools, function (index, tool) {
            cards += '<span class="filter" onclick="filterJobs(\'' + tool + '\')">' + tool + '</span>';
        });
        // cards+='<div class="delete></div>';
        cards += `</div>
        <div class="delete" onclick="deleteJob(${value.id})">
        </div>
        </div>`;

    });


    $(".main").append(cards);
}
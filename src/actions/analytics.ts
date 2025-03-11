import { supabaseClient } from "@/shared/lib/supabase/client";
import { ViewTimeRangeOptions } from "@/shared/types";


export type CountryViewData = {
    views: number;
    code: string;
    country: string
}

export interface ViewsAnalytics {
    totalViews: number
    countryViews: CountryViewData[]
    timeInterval: ViewTimeRangeOptions
}


// Function to group data by interval (hour, day)
export const groupDataByInterval = (
    data: { created_at: string }[], // Stronger typing instead of `any`
    interval: '24h' | '7d' | '30d' | '90d'
): { time_period: string; views_count: number }[] => {
    const grouped: Record<string, number> = {};

    // Define the start time and step size based on interval
    const now = new Date();
    const start = new Date();
    let step: 'hour' | 'day';

    switch (interval) {
        case '24h':
            start.setHours(start.getHours() - 24);
            step = 'hour';
            break;
        case '7d':
            start.setDate(start.getDate() - 7);
            step = 'day';
            break;
        case '30d':
            start.setDate(start.getDate() - 30);
            step = 'day';
            break;
        case '90d':
            start.setDate(start.getDate() - 90);
            step = 'day';
            break;
    }

    // Initialize the full range with zero values
    const timeRange: string[] = [];
    const current = new Date(start);

    while (current <= now) {
        const timePeriod = step === 'hour'
            ? current.toISOString().slice(0, 13) // "2025-03-06T18"
            : current.toISOString().slice(0, 10); // "2025-03-06"

        timeRange.push(timePeriod);
        grouped[timePeriod] = 0;

        if (step === 'hour') {
            current.setHours(current.getHours() + 1);
        } else {
            current.setDate(current.getDate() + 1);
        }
    }

    // Count actual views from data
    data.forEach((view) => {
        const date = new Date(view.created_at);
        const timePeriod = step === 'hour'
            ? date.toISOString().slice(0, 13)
            : date.toISOString().slice(0, 10);

        grouped[timePeriod] = (grouped[timePeriod] || 0) + 1;
    });

    // Convert to sorted array
    return timeRange.map((timePeriod) => ({
        time_period: timePeriod,
        views_count: grouped[timePeriod],
    }));
};





export type CountryView = {
    country: string; // full country name or fallback to the code
    code: string;    // country code stored in the DB
    views: number;
};

export async function getCountryViews(
    post_id: string,
    interval: "24h" | "7d" | "30d" | "90d"
): Promise<CountryView[]> {
    // Determine the start date based on the given interval
    const now = new Date();
    let intervalInMs: number;

    switch (interval) {
        case "24h":
            intervalInMs = 24 * 60 * 60 * 1000;
            break;
        case "7d":
            intervalInMs = 7 * 24 * 60 * 60 * 1000;
            break;
        case "30d":
            intervalInMs = 30 * 24 * 60 * 60 * 1000;
            break;
        case "90d":
            intervalInMs = 90 * 24 * 60 * 60 * 1000;
            break;
        default:
            throw new Error("Invalid interval");
    }

    const startDate = new Date(now.getTime() - intervalInMs);


    // Query the views that have been created after the start date.
    const { data, error } = await supabaseClient
        .from('views')
        .select('country')
        .eq('post_id', post_id)
        .gte('created_at', startDate.toISOString());

    if (error) {
        throw error;
    }

    // Group results by country code and count the views.
    const countryCounts = data.reduce((acc, row) => {
        const code = row.country || "Unknown";
        acc[code] = (acc[code] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Map country codes to full country names.
    const countryNames: Record<string, string> = {
        "AF": "Afghanistan",
        "AX": "Åland Islands",
        "AL": "Albania",
        "DZ": "Algeria",
        "AS": "American Samoa",
        "AD": "Andorra",
        "AO": "Angola",
        "AI": "Anguilla",
        "AQ": "Antarctica",
        "AG": "Antigua and Barbuda",
        "AR": "Argentina",
        "AM": "Armenia",
        "AW": "Aruba",
        "AU": "Australia",
        "AT": "Austria",
        "AZ": "Azerbaijan",
        "BS": "Bahamas",
        "BH": "Bahrain",
        "BD": "Bangladesh",
        "BB": "Barbados",
        "BY": "Belarus",
        "BE": "Belgium",
        "BZ": "Belize",
        "BJ": "Benin",
        "BM": "Bermuda",
        "BT": "Bhutan",
        "BO": "Bolivia",
        "BQ": "Bonaire, Sint Eustatius and Saba",
        "BA": "Bosnia and Herzegovina",
        "BW": "Botswana",
        "BV": "Bouvet Island",
        "BR": "Brazil",
        "IO": "British Indian Ocean Territory",
        "BN": "Brunei Darussalam",
        "BG": "Bulgaria",
        "BF": "Burkina Faso",
        "BI": "Burundi",
        "KH": "Cambodia",
        "CM": "Cameroon",
        "CA": "Canada",
        "CV": "Cape Verde",
        "KY": "Cayman Islands",
        "CF": "Central African Republic",
        "TD": "Chad",
        "CL": "Chile",
        "CN": "China",
        "CX": "Christmas Island",
        "CC": "Cocos (Keeling) Islands",
        "CO": "Colombia",
        "KM": "Comoros",
        "CG": "Congo",
        "CD": "Congo, Democratic Republic of the",
        "CK": "Cook Islands",
        "CR": "Costa Rica",
        "CI": "Côte d'Ivoire",
        "HR": "Croatia",
        "CU": "Cuba",
        "CW": "Curaçao",
        "CY": "Cyprus",
        "CZ": "Czech Republic",
        "DK": "Denmark",
        "DJ": "Djibouti",
        "DM": "Dominica",
        "DO": "Dominican Republic",
        "EC": "Ecuador",
        "EG": "Egypt",
        "SV": "El Salvador",
        "GQ": "Equatorial Guinea",
        "ER": "Eritrea",
        "EE": "Estonia",
        "ET": "Ethiopia",
        "FK": "Falkland Islands (Malvinas)",
        "FO": "Faroe Islands",
        "FJ": "Fiji",
        "FI": "Finland",
        "FR": "France",
        "GF": "French Guiana",
        "PF": "French Polynesia",
        "TF": "French Southern Territories",
        "GA": "Gabon",
        "GM": "Gambia",
        "GE": "Georgia",
        "DE": "Germany",
        "GH": "Ghana",
        "GI": "Gibraltar",
        "GR": "Greece",
        "GL": "Greenland",
        "GD": "Grenada",
        "GP": "Guadeloupe",
        "GU": "Guam",
        "GT": "Guatemala",
        "GG": "Guernsey",
        "GN": "Guinea",
        "GW": "Guinea-Bissau",
        "GY": "Guyana",
        "HT": "Haiti",
        "HM": "Heard Island and McDonald Islands",
        "VA": "Vatican City",
        "HN": "Honduras",
        "HK": "Hong Kong",
        "HU": "Hungary",
        "IS": "Iceland",
        "IN": "India",
        "ID": "Indonesia",
        "IR": "Iran",
        "IQ": "Iraq",
        "IE": "Ireland",
        "IM": "Isle of Man",
        "IL": "Israel",
        "IT": "Italy",
        "JM": "Jamaica",
        "JP": "Japan",
        "JE": "Jersey",
        "JO": "Jordan",
        "KZ": "Kazakhstan",
        "KE": "Kenya",
        "KI": "Kiribati",
        "KP": "North Korea",
        "KR": "South Korea",
        "KW": "Kuwait",
        "KG": "Kyrgyzstan",
        "LA": "Laos",
        "LV": "Latvia",
        "LB": "Lebanon",
        "LS": "Lesotho",
        "LR": "Liberia",
        "LY": "Libya",
        "LI": "Liechtenstein",
        "LT": "Lithuania",
        "LU": "Luxembourg",
        "MO": "Macao",
        "MK": "North Macedonia",
        "MG": "Madagascar",
        "MW": "Malawi",
        "MY": "Malaysia",
        "MV": "Maldives",
        "ML": "Mali",
        "MT": "Malta",
        "MH": "Marshall Islands",
        "MQ": "Martinique",
        "MR": "Mauritania",
        "MU": "Mauritius",
        "YT": "Mayotte",
        "MX": "Mexico",
        "FM": "Micronesia",
        "MD": "Moldova",
        "MC": "Monaco",
        "MN": "Mongolia",
        "ME": "Montenegro",
        "MS": "Montserrat",
        "MA": "Morocco",
        "MZ": "Mozambique",
        "MM": "Myanmar",
        "NA": "Namibia",
        "NR": "Nauru",
        "NP": "Nepal",
        "NL": "Netherlands",
        "NC": "New Caledonia",
        "NZ": "New Zealand",
        "NI": "Nicaragua",
        "NE": "Niger",
        "NG": "Nigeria",
        "NU": "Niue",
        "NF": "Norfolk Island",
        "MP": "Northern Mariana Islands",
        "NO": "Norway",
        "OM": "Oman",
        "PK": "Pakistan",
        "PW": "Palau",
        "PS": "Palestine",
        "PA": "Panama",
        "PG": "Papua New Guinea",
        "PY": "Paraguay",
        "PE": "Peru",
        "PH": "Philippines",
        "PL": "Poland",
        "PT": "Portugal",
        "PR": "Puerto Rico",
        "QA": "Qatar",
        "RO": "Romania",
        "RU": "Russia",
        "RW": "Rwanda",
        "SA": "Saudi Arabia",
        "SN": "Senegal",
        "RS": "Serbia",
        "SC": "Seychelles",
        "SL": "Sierra Leone",
        "SG": "Singapore",
        "SK": "Slovakia",
        "SI": "Slovenia",
        "ZA": "South Africa",
        "ES": "Spain",
        "SE": "Sweden",
        "CH": "Switzerland",
        "TH": "Thailand",
        "TR": "Turkey",
        "UA": "Ukraine",
        "AE": "United Arab Emirates",
        "GB": "United Kingdom",
        "US": "United States",
        "VN": "Vietnam",
        "ZW": "Zimbabwe"
    };


    // Convert the aggregated data to the expected result array.
    const result: CountryView[] = Object.entries(countryCounts)
        .map(([code, views]) => ({
            code,
            views,
            country: countryNames[code] || code
        }))
        // Optional: sort by descending views
        .sort((a, b) => b.views - a.views);

    return result;
}



// Define types for clarity.
export type AnalyticsComment = {
    profile_id: string;
    text: string;
    created_at: string;
};

export type AnalyticsReaction = {
    id: string;
    profile_id: string;
    created_at: string;
};

export type ActivityItem = (AnalyticsComment & { type: "comment" }) | (AnalyticsReaction & { type: "like" });

export async function getActivityLog(post_id: string): Promise<ActivityItem[]> {
    // Fetch comments from the "comments" table.
    const { data: comments, error: commentsError } = await supabaseClient
        .from("comments")
        .select("profile_id, text, created_at")
        .eq("post_id", post_id);

    if (commentsError) {
        throw new Error(commentsError.message);
    }

    // Fetch reactions (likes) from the "reactions" table.
    const { data: reactions, error: reactionsError } = await supabaseClient
        .from("reactions")
        .select("id, profile_id, created_at")
        .eq("post_id", post_id);

    if (reactionsError) {
        throw new Error(reactionsError.message);
    }

    // Map comments and reactions to a unified ActivityItem type.
    const commentActivities = (comments || []).map((comment) => ({
        ...comment,
        type: "comment" as const,
    }));

    const reactionActivities = (reactions || []).map((reaction) => ({
        ...reaction,
        type: "like" as const,
    }));

    // Combine the two arrays and sort by created_at descending.
    const combined = [...commentActivities, ...reactionActivities];
    combined.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return combined;
}

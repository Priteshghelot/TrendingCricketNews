export const getFlagCode = (teamName: string): string => {
    const lower = teamName.toLowerCase().trim();
    // Full Members
    if (lower.includes('india') || lower === 'ind') return 'in';
    if (lower.includes('australia') || lower === 'aus') return 'au';
    if (lower.includes('england') || lower === 'eng') return 'gb-eng';
    if (lower.includes('south africa') || lower === 'sa') return 'za';
    if (lower.includes('new zealand') || lower === 'nz') return 'nz';
    if (lower.includes('pakistan') || lower === 'pak') return 'pk';
    if (lower.includes('sri lanka') || lower === 'sl') return 'lk';
    if (lower.includes('bangladesh') || lower === 'ban') return 'bd';
    if (lower.includes('west indies') || lower === 'wi') return 'jm';
    if (lower.includes('afghanistan') || lower === 'afg') return 'af';
    if (lower.includes('zimbabwe') || lower === 'zim') return 'zw';
    if (lower.includes('ireland') || lower === 'ire') return 'ie';

    // Associate Members & Others
    if (lower.includes('nepal') || lower === 'nep') return 'np';
    if (lower.includes('netherlands') || lower === 'ned') return 'nl';
    if (lower.includes('namibia') || lower === 'nam') return 'na';
    if (lower.includes('scotland') || lower === 'sco') return 'gb-sct';
    if (lower.includes('uae') || lower.includes('united arab emirates')) return 'ae';
    if (lower.includes('usa') || lower.includes('united states') || lower === 'us') return 'us';
    if (lower.includes('oman') || lower === 'oma') return 'om';
    if (lower.includes('papua new guinea') || lower === 'png') return 'pg';
    if (lower.includes('canada') || lower === 'can') return 'ca';
    if (lower.includes('hong kong') || lower === 'hk') return 'hk';
    if (lower.includes('kenya') || lower === 'ken') return 'ke';
    if (lower.includes('bermuda') || lower === 'ber') return 'bm';
    if (lower.includes('uganda') || lower === 'uga') return 'ug';
    if (lower.includes('jersey') || lower === 'jer') return 'je';
    if (lower.includes('kuwait') || lower === 'kuw') return 'kw';
    if (lower.includes('malaysia') || lower === 'mal') return 'my';

    // Domestic / Leagues
    if (lower.includes('heat') || lower.includes('scorchers') || lower.includes('sixers') || lower.includes('stars') || lower.includes('thunder') || lower.includes('renegades') || lower.includes('hurricanes') || lower.includes('strikers')) return 'au';
    if (lower.includes('chennai') || lower.includes('mumbai') || lower.includes('bangalore') || lower.includes('delhi') || lower.includes('kolkata') || lower.includes('punjab') || lower.includes('rajasthan') || lower.includes('hyderabad') || lower.includes('gujarat') || lower.includes('lucknow')) return 'in';

    return 'un';
};

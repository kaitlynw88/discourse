import { createUid, generateMediaChannelKey } from "agora-rtc-sdk";

const appId = "c09cde14905f4906951bfbc5deebf2b8";

const appCertificate = "ed1f2b23520a44a7ba1b924243e42e4f";

export const generateTokenHost = async (channelName) => {
    // const channelName = "YOUR_CHANNEL_NAME";
    const uid = createUid(1);

    // Generate a token for the user with role 'host'
    const token = generateMediaChannelKey(
        appId,
        appCertificate,
        channelName,
        uid,
        "host"
    );

    return token;
};

export const generateTokenAudience = async (channelName) => {
    // const channelName = "YOUR_CHANNEL_NAME";
    const uid = 0;
    console.log(uid);
    // Generate a token for the user with role 'audience'
    const token = generateMediaChannelKey(
        appId,
        appCertificate,
        channelName,
        uid,
        "audience"
    );

    return token;
};

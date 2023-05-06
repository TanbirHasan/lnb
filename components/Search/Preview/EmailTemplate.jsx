const placeholderImage =
  "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";

export default function EmailTemplateRenderer({
  headTitle = null,
  subject,
  mailBody,
  senderData,
  senderInfoData,
}) {
  headTitle = headTitle || "Local New Business";
  const emailImage =
    (senderData ? senderData?.logoUrl : senderInfoData[0]?.logoUrl) ||
    placeholderImage;



  return `
        <!DOCTYPE html>
          <html lang="en"  style="color-scheme: light;">
          <head>
            <meta charset="utf-8">
            <meta name="x-apple-disable-message-reformatting">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
            <meta name="color-scheme" content="light dark">
            <meta name="supported-color-schemes" content="light dark">
            <!--[if mso]>
            <noscript>
              <xml>
                <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
              </xml>
            </noscript>
            <style>
              td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
            </style>
            <![endif]-->    <title>${headTitle}</title>
            <style>:root {
            color-scheme: light dark;
          }
        .material-symbols-outlined {
          font-variation-settings:
          'FILL' 0,
          'wght' 400,
          'GRAD' 0,
          'opsz' 48
        }
          
          </style>
        </head>
         
          <body style="-webkit-font-smoothing: antialiased; word-break: break-word; margin: 0; width: 100%; background-color: #f8fafc; padding: 0">
            <div role="article" aria-roledescription="email" aria-label="${headTitle}" lang="en">
            <div style="position: relative; background-color: #19253F; padding: 8px">
                <div style="position: absolute; right: 0; margin-top: 8px; min-width: 180px; border-bottom-left-radius: 9999px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; background-color: #00B3C6; padding: 8px"></div>
              </div>
              <div style="padding: 20px; padding-left: 28px; padding-right: 28px">
              ${
                emailImage.length > 16
                  ? ` <div style="margin-top: 20px; margin-bottom: 20px">
                <img  src="https://lnb-data.s3.eu-west-2.amazonaws.com/logos/${emailImage}"  alt="letter-sender-logo" style="height: 64px">
              </div>`
                  : ``
              }
              
               
                <div style="display: flex; height: 100%; min-height: 60vh; flex-direction: column; justify-content: space-between">
                  <div>
                    <div style="font-size: 18px; color: #6b7280">[Company Name]</div>
                    <h1 style="margin-bottom: 20px; margin-top: 20px; font-weight: 600">
                      ${subject.charAt(0).toUpperCase() + subject.slice(1)}
                    </h1>
                    <p style="margin-bottom: 12px">Greetings,</p>
                     ${
                       mailBody?.charAt(0) !== "<"
                         ? `<p style="white-space: pre-line; margin-bottom: 12px">${mailBody}</p>`
                         : `<p style="margin-bottom: 12px">${mailBody}</p>`
                     }
                  </div>
                  <div style="margin-bottom: 20px; margin-top: 40px; display: flex; flex-direction: column">
                    <h1 style="margin-bottom: 20px; font-size: 16px; font-weight: 700; line-height: 24px">
                      ${
                        senderData
                          ? senderData?.companyName
                          : senderInfoData[0]?.companyName
                      }
                    </h1>
                    <div style="display: flex; align-items: center; gap: 8px">
                      <div style="display: flex; align-items: center; background-color: #00B3C6; padding: 4px">
                       <span style="height: 20px; width: 20px; color: #fff">
                               <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M795 936q-122 0-242.5-60T336 720q-96-96-156-216.5T120 261q0-19.286 12.857-32.143T165 216h140q13.611 0 24.306 9.5Q340 235 343 251l27 126q2 14-.5 25.5T359 422L259 523q56 93 125.5 162T542 802l95-98q10-11 23-15.5t26-1.5l119 26q15.312 3.375 25.156 15.188Q840 740 840 756v135q0 19.286-12.857 32.143T795 936ZM229 468l81-82-23-110H180q0 39 12 85.5T229 468Zm369 363q41 19 89 31t93 14V769l-103-21-79 83ZM229 468Zm369 363Z"/></svg>
                       
                      <span>
                      </div>
                      <p style="padding-bottom: 4px; padding-left: 4px">
                       ${
                         senderData
                           ? senderData?.phone
                           : senderInfoData[0]?.phone
                       }
                      </p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px">
                      <div style="display: flex; align-items: center; background-color: #00B3C6; padding: 4px">
                       <span style="height: 20px; width: 20px; color: #fff">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" height="20" viewBox="0 96 960 960" width="20"><path d="M140 896q-24 0-42-18t-18-42V316q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Zm340-302L140 371v465h680V371L480 594Zm0-60 336-218H145l335 218ZM140 371v-55 520-465Z"/></svg>
                      <span>
                      </div>
                      <p style="padding-bottom: 4px; padding-left: 4px">
                        ${
                          senderData
                            ? senderData?.email
                            : senderInfoData[0]?.email
                        }
                      </p>
                    </div>
                      ${
                        senderData?.website?.length !== 0
                          ? ` <div style="display: flex; align-items: center; gap: 8px">
                              <div style="display: flex; align-items: center; background-color: #00B3C6; padding: 4px">
                               <span style="color: #fff">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" height="20" viewBox="0 96 960 960" width="20"><path d="M480 976q-84 0-157-31.5T196 859q-54-54-85-127.5T80 574q0-84 31-156.5T196 291q54-54 127-84.5T480 176q84 0 157 30.5T764 291q54 54 85 126.5T880 574q0 84-31 157.5T764 859q-54 54-127 85.5T480 976Zm0-58q35-36 58.5-82.5T577 725H384q14 60 37.5 108t58.5 85Zm-85-12q-25-38-43-82t-30-99H172q38 71 88 111.5T395 906Zm171-1q72-23 129.5-69T788 725H639q-13 54-30.5 98T566 905ZM152 665h159q-3-27-3.5-48.5T307 574q0-25 1-44.5t4-43.5H152q-7 24-9.5 43t-2.5 45q0 26 2.5 46.5T152 665Zm221 0h215q4-31 5-50.5t1-40.5q0-20-1-38.5t-5-49.5H373q-4 31-5 49.5t-1 38.5q0 21 1 40.5t5 50.5Zm275 0h160q7-24 9.5-44.5T820 574q0-26-2.5-45t-9.5-43H649q3 35 4 53.5t1 34.5q0 22-1.5 41.5T648 665Zm-10-239h150q-33-69-90.5-115T565 246q25 37 42.5 80T638 426Zm-254 0h194q-11-53-37-102.5T480 236q-32 27-54 71t-42 119Zm-212 0h151q11-54 28-96.5t43-82.5q-75 19-131 64t-91 115Z"/></svg>
                              <span>
                              </div>
                              <p style="padding-bottom: 4px; padding-left: 4px">
                                ${
                                  senderData
                                    ? senderData?.website
                                    : senderInfoData[0]?.website
                                }
                              </p>
                            </div>`
                          : ``
                      }
                    <div style="display: flex; align-items: center; gap: 8px">
                      <div style="display: flex; align-items: center; background-color: #00B3C6; padding: 4px">
                       <span style="height: 20px; width: 20px; color: #fff">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" height="20" viewBox="0 96 960 960" width="20"><path d="M480.089 566Q509 566 529.5 545.411q20.5-20.588 20.5-49.5Q550 467 529.411 446.5q-20.588-20.5-49.5-20.5Q451 426 430.5 446.589q-20.5 20.588-20.5 49.5Q410 525 430.589 545.5q20.588 20.5 49.5 20.5ZM480 897q133-121 196.5-219.5T740 504q0-117.79-75.292-192.895Q589.417 236 480 236t-184.708 75.105Q220 386.21 220 504q0 75 65 173.5T480 897Zm0 79Q319 839 239.5 721.5T160 504q0-150 96.5-239T480 176q127 0 223.5 89T800 504q0 100-79.5 217.5T480 976Zm0-472Z"/></svg>
                      <span>
                       </div>
                      <p style="padding-bottom: 4px; padding-left: 4px">
                        ${
                          senderData
                            ? senderData?.city ||
                              "" + " , " + senderData?.city ||
                              "" + " - " + senderData?.postcode ||
                              ""
                            : senderInfoData[0]?.city ||
                              "" + " , " + senderInfoData[0]?.city ||
                              "" + " - " + senderInfoData[0]?.postcode ||
                              ""
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr))">
                <div style="background-color: #19253F; padding: 8px"></div>
                <div style="grid-column: span 2 / span 2; background-color: #00B3C6; padding: 8px"></div>
                <div style="background-color: #19253F; padding: 8px"></div>
              </div>  </div>
          </body>
          </html>
        `;
}

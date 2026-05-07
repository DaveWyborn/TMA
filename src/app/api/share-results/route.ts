import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

/*
 * Email Setup Instructions:
 * 1. Create Gmail app password: https://myaccount.google.com/apppasswords
 * 2. Add to .env.local:
 *    EMAIL_USER=hello@tailormadeanalytics.com
 *    EMAIL_PASS=your-gmail-app-password
 *    EMAIL_TO=hello@tailormadeanalytics.com
 *
 * For production, add same variables to Vercel environment variables.
 */

export async function POST(request: Request) {
  const body = await request.json();
  const { toolName, scannedUrl, name, email, comments } = body;

  // Log to Supabase for tracking
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // Store in database
    const { error: insertError } = await supabase.from('tma_shared_results').insert({
      tool_name: toolName,
      scanned_url: scannedUrl,
      client_name: name,
      client_email: email,
      comments: comments || null,
    });

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      // Don't fail the request if logging fails
    }

    // Send email notification if credentials configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"TMA SEO Tools" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_TO || process.env.EMAIL_USER,
          subject: `Client Shared ${toolName} Results`,
          html: `
            <h2>New SEO Tool Results Shared</h2>
            <p><strong>Tool:</strong> ${toolName}</p>
            <p><strong>URL Scanned:</strong> <a href="${scannedUrl}">${scannedUrl}</a></p>
            <hr>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${comments ? `<p><strong>Comments:</strong><br>${comments.replace(/\n/g, '<br>')}</p>` : '<p><em>No comments provided</em></p>'}
            <hr>
            <p style="font-size: 12px; color: #666;">To review the results, visit <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://tailormadeanalytics.com'}${toolName === 'Meta Checker' ? '/meta-checker' : toolName === 'Keyword Analyser' ? '/keyword-analyser' : toolName === 'Page Speed Checker' ? '/page-speed' : '/robots-checker'}">the tool</a> and scan the same URL.</p>
          `,
        });

        console.log('✓ Email sent successfully');
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
        // Don't fail the request if email fails - still logged in database
      }
    } else {
      console.log('⚠ Email not configured - results logged to database only');
      console.log('=== SHARED RESULTS NOTIFICATION ===');
      console.log('Tool:', toolName);
      console.log('URL:', scannedUrl);
      console.log('From:', name, `<${email}>`);
      console.log('Comments:', comments || 'None');
      console.log('===================================');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Share results error:', err);
    return NextResponse.json({ success: false, error: 'Failed to share results' }, { status: 500 });
  }
}
